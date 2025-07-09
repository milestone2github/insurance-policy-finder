import "dotenv/config";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import FormData from "form-data";
import { Buffer } from "buffer";
import { CHECK_ZOHO_LEAD_URL, ADD_ZOHO_INVESTMENT_LEAD_URL } from "./constants";
// import { writeFileSync } from "fs";
// import path from "path";

interface ZohoUser {
	email: string;
	id: string;
}

export async function submitLeadToCRM(data: {
	profiles: any;
	personal: any;
	lifestyle: any;
	medicalCondition: any;
	existingPolicy: any;
	phone: string;
	name: string;
}) {
	const {
		profiles,
		personal,
		lifestyle,
		medicalCondition,
		existingPolicy,
		phone,
		name,
	} = data;

	// 1. Get Zoho access token
	const payload = new URLSearchParams({
		refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
		client_id: process.env.ZOHO_CLIENT_ID!,
		client_secret: process.env.ZOHO_CLIENT_SECRET!,
		grant_type: "refresh_token",
	});

	const res = await axios.post(
		"https://accounts.zoho.com/oauth/v2/token",
		payload.toString(),
		{ headers: { "Content-Type": "application/x-www-form-urlencoded" } }
	);

	const token = res.data.access_token;
	const headers = { Authorization: `Zoho-oauthtoken ${token}` };

	// 2. Get RM owner ID
	const resUsers = await axios.get(
		"https://www.zohoapis.com/crm/v2/users?type=ActiveUsers",
		{ headers }
	);
	const users: ZohoUser[] = resUsers.data.users || [];
	const defaultOwnerId = process.env.ZOHO_DEFAULT_OWNER_ID;
	const emailToId = new Map(users.map((u) => [u.email.toLowerCase(), u.id]));
	const rmOptions = ["sagar maini", "ishu mavar", "yatin munjal"];
	const randomRM = rmOptions[Math.floor(Math.random() * rmOptions.length)];
  const ownerId = emailToId.get(`${randomRM}@niveshonline.com`) ?? defaultOwnerId;

	// 3. Check if lead exists
	const searchRes = await axios.get(
		CHECK_ZOHO_LEAD_URL(phone),
		{ headers }
	);
	const existingLead = searchRes.data?.data?.[0];
	let leadId = existingLead?.id;

	console.log("Existing Lead Id: ", leadId);

	const leadPayload = {
		data: [
			{
				Name: name,
				Mobile: phone,
				Owner: ownerId,
				Product_Type: "Mutual Fund",
				Refrencer_Name: "WA Marketing",
			},
		],
	};

	// 4. Create or update lead
	if (leadId) {
		await axios.put(
			ADD_ZOHO_INVESTMENT_LEAD_URL,
			{ data: [{ id: leadId, ...leadPayload.data[0] }] },
			{ headers }
		);
	} else {
		const leadRes = await axios.post(
			ADD_ZOHO_INVESTMENT_LEAD_URL,
			leadPayload,
			{ headers }
		);
		leadId = leadRes.data?.data?.[0]?.details?.id;
		if (!leadId) throw new Error("Failed to get lead ID.");
		
		console.log("New Lead generated: ", leadId);
	}

	// 5. Generate PDF
	const doc = new jsPDF();

	doc.text("Insurance Review", 14, 16);
	autoTable(doc, {
		startY: 24,
		head: [["Section", "Details"]],
		body: [
			["Name", name],
			["Phone", phone],
			["Profiles", JSON.stringify(profiles)],
			["Personal", JSON.stringify(personal)],
			["Lifestyle", JSON.stringify(lifestyle)],
			["Medical", JSON.stringify(medicalCondition)],
			["Existing Policy", JSON.stringify(existingPolicy)],
		],
	});

  const arrayBuffer = doc.output("arraybuffer");
	// const filePath = path.join("/tmp", `insurance_review_${phone}.pdf`);
	// writeFileSync(filePath, doc.output("arraybuffer"));

	// 6. Upload PDF
  const form = new FormData();
	form.append(
		"file",
		Buffer.from(new Uint8Array(arrayBuffer)),
		"Insurance_Review.pdf"
	);

  await axios.post(
    `https://www.zohoapis.com/crm/v2/Investment_leads/${leadId}/Attachments`,
    form,
		{
			headers: {
				...form.getHeaders(),
				Authorization: `Zoho-oauthtoken ${token}`,
			},
		}
	);
}
