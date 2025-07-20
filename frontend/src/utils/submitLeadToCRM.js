// utils/submitLead.ts
import axios from "axios";
import { exportReviewAsPDF } from "./exportReviewAsPDF";

const ZOHO_REFRESH_TOKEN = import.meta.env.VITE_ZOHO_REFRESH_TOKEN;
const ZOHO_CLIENT_ID = import.meta.env.VITE_ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = import.meta.env.VITE_ZOHO_CLIENT_SECRET;

const getZohoAccessToken = async () => {
	const payload = new URLSearchParams({
		refresh_token: ZOHO_REFRESH_TOKEN,
		client_id: ZOHO_CLIENT_ID,
		client_secret: ZOHO_CLIENT_SECRET,
		grant_type: "refresh_token",
	});
	const res = await axios.post(
		"https://accounts.zoho.com/oauth/v2/token",
		payload.toString(),
		{ headers: { "Content-Type": "application/x-www-form-urlencoded" } }
	);
	console.log("Access Token ==> ", res.data.access_token);
	return res.data.access_token;
};

export const submitLeadToCRM = async (stateData) => {
	try {
		console.log("inside TRY part");

		const { profiles, personal, lifestyle, medicalCondition, existingPolicy } = stateData;
		const name = personal.personalInfo.myself.name || "";
		const modal = JSON.parse(localStorage.getItem("leadDetails") || "{}");
		const { phone } = modal;
		if (!name || !phone) return (console.log("Lead details not found."));

		const pdfBlob = exportReviewAsPDF(
			{ profiles, personal, lifestyle, medicalCondition, existingPolicy },
			{ returnBlob: true }
		);

		const token = await getZohoAccessToken();
		const headers = { Authorization: `Zoho-oauthtoken ${token}` };

		// Fetch Zoho Users for random RM assignment
		const resUsers = await axios.get(
			"https://www.zohoapis.com/crm/v2/users?type=ActiveUsers",
			{ headers }
		);
		const users = resUsers.data.users || [];
		const emailToId = new Map(users.map((u) => [u.email.toLowerCase(), u.id]));
		const rmOptions = ["sagar maini", "ishu mavar", "yatin munjal"];
		const randomRM = rmOptions[Math.floor(Math.random() * rmOptions.length)];
		const ownerId =
			emailToId.get(`${randomRM}@niveshonline.com`) ?? "2969103000000183019";

		// Check if lead already exists (by phone)
		const searchRes = await axios.get(
			`https://www.zohoapis.com/crm/v2/Investment_leads/search?criteria=(Mobile:equals:${phone})`,
			{ headers }
		);

		const existingLead = searchRes.data?.data?.[0];
		let leadId = existingLead?.id;

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

		if (leadId) {
			// Update existing lead
			await axios.put(
				`https://www.zohoapis.com/crm/v2/Investment_leads`,
				{
					data: [{ id: leadId, ...leadPayload.data[0] }],
				},
				{ headers }
			);
		} else {
			// Create new lead
			const leadRes = await axios.post(
				"https://www.zohoapis.com/crm/v2/Investment_leads",
				leadPayload,
				{ headers }
			);
			leadId = leadRes.data?.data?.[0]?.details?.id;
			if (!leadId) throw new Error("Failed to get lead ID from CRM response.");
			else console.log("Lead ID generated ===> ", leadId);
		}

		// Upload PDF
		const form = new FormData();
		form.append("file", pdfBlob, "Insurance_Review.pdf");

		const pdfUploaded = await axios.post(
			`https://www.zohoapis.com/crm/v2/Investment_leads/${leadId}/Attachments`,
			form,
			{ headers }
		);
		console.log("PDF uploaded to Lead!", pdfUploaded);
	} catch (err) {
		console.error("CRM Upload Failed:", err?.response?.data || err.message);
		throw new Error;
	}
};
