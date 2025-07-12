import axios from "axios";
import FormData from "form-data";
import {
	ADD_ZOHO_INSURANCE_LEAD_URL,
	CHECK_ZOHO_LEAD_URL,
	UPLOAD_LEAD_FILE_URL,
	ZOHO_TOKEN_EXTRACTION_URL,
} from "./constants";

export async function submitLeadToCRM(data: {
	phone: string;
	name: string;
	lead_id?: string;
	uploadedFile: Express.Multer.File | undefined;
}) {
	try {
		const { phone, name, lead_id, uploadedFile } = data;

		if (!phone) throw new Error("Phone number not found.");
		if (!uploadedFile) throw new Error("No file uploaded.");

		let leadId = lead_id;

		// 1. Get Zoho token
		const tokenRes = await axios.post(
			ZOHO_TOKEN_EXTRACTION_URL,
			new URLSearchParams({
				refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
				client_id: process.env.ZOHO_CLIENT_ID!,
				client_secret: process.env.ZOHO_CLIENT_SECRET!,
				grant_type: "refresh_token",
			}).toString()
		);

		const token = tokenRes.data.access_token;
		console.log("Latest Token: ", token);			// for Debugging in Postman
		
		const headers = {
			Authorization: `Zoho-oauthtoken ${token}`,
		};

		// 2. Prepare lead payload
		const ownerId = process.env.HEALTH_RM_ID;
		const leadPayload = {
			data: [
				{
					Name: name,
					Phone: phone,
					Owner: ownerId,
					Product: "Health Insurance",
				},
			],
		};

		// 3. Update lead if exists
		if (leadId) {
			const searchRes = await axios.get(CHECK_ZOHO_LEAD_URL(leadId), {
				headers,
			});
			const existingLead = searchRes.data?.data?.[0];
			if (existingLead) {
				await axios.post(
					ADD_ZOHO_INSURANCE_LEAD_URL,
					{ data: [{ id: leadId, ...leadPayload.data[0] }] },
					{ headers }
				);
			}
		} else {
			// 4. Add new lead if leadId doesn't exist
			const leadRes = await axios.post(ADD_ZOHO_INSURANCE_LEAD_URL, leadPayload, {
				headers,
			});
			leadId = leadRes.data?.data?.[0]?.details?.id;
			if (!leadId) throw new Error("Failed to get lead ID.");
		}


		// 5. Prepare and upload PDF
		const form = new FormData();
		form.append("file", uploadedFile.buffer, {
			filename: "Insurance_Review.pdf",
			contentType: uploadedFile.mimetype,
		});

		await axios.post(`${UPLOAD_LEAD_FILE_URL}/${leadId}/Attachments`, form, {
			headers: {
				...form.getHeaders(),	// Multipart-headers
				Authorization: `Zoho-oauthtoken ${token}`,
			},
		});

		console.log("PDF uploaded successfully.");
		return leadId;
	} catch (err) {
		console.error("Lead submission failed:", err);
		throw err;
	}
}
