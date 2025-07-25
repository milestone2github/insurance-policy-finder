const axios = require("axios");
const FormData = require("form-data");
const {
  ADD_ZOHO_INSURANCE_LEAD_URL,
  CHECK_ZOHO_LEAD_URL,
  UPLOAD_LEAD_FILE_URL,
  ZOHO_TOKEN_EXTRACTION_URL,
	HEALTH_RM_ID_LIST,
	CHECK_ZOHO_LEAD_VIA_PHONE,
} = require("./constants");

async function submitLeadToCRM(data) {
	try {
		const { phone, name, lead_id, uploadedFile } = data;

		if (!phone) throw new Error("Phone number not found.");
		if (!uploadedFile) throw new Error("No file uploaded.");

		let leadId = lead_id;

		// 1. Get Zoho token
		const tokenRes = await axios.post(
			ZOHO_TOKEN_EXTRACTION_URL,
			new URLSearchParams({
				refresh_token: process.env.ZOHO_REFRESH_TOKEN,
				client_id: process.env.ZOHO_CLIENT_ID,
				client_secret: process.env.ZOHO_CLIENT_SECRET,
				grant_type: "refresh_token",
			}).toString()
		);

		const token = tokenRes.data.access_token;
		console.log("Access Token debug: ", token);
		
		const headers = {
			Authorization: `Zoho-oauthtoken ${token}`,
		};

		let ownerId = "";
		let existingLeadFlag = false;
		// Find lead via leadId stored in localstorage
		if (leadId) {
			try {
				const searchRes = await axios.get(CHECK_ZOHO_LEAD_URL(leadId), {
					headers,
				});
				const existingLead = searchRes.data?.data?.[0];
				
				if (existingLead) {
					ownerId = existingLead.Owner.id;
					existingLeadFlag = true;
				}
			} catch (err) {
				console.warn("Lead ID lookup failed or not found in CRM.");
			}
		}

		// Lead Id exists but failed to fetch lead from CRM, try fetching it via phone
		if (!existingLeadFlag) {
			try {
				const phoneRes = await axios.get(CHECK_ZOHO_LEAD_VIA_PHONE(phone), {
					headers,
				});
				const checkLeadExist = phoneRes.data?.data?.[0];

				if (checkLeadExist) {
					ownerId = checkLeadExist.Owner.id; 	// Fetch owner id (RM) from existing lead
					leadId = checkLeadExist.id;					// Fetch lead id
					console.log("Lead exists in CRM. Owner Id = ", ownerId);
					existingLeadFlag = true;
				}
			} catch (err) {
				console.warn("Failed to fetch Lead via phone number.");
			}
		}

		// Lead doesn't exist in CRM, Create a new one with random RM
		if (!existingLeadFlag) {
			console.log("Lead doesn't exist. Creating a new one...");
			const randomIndex = Math.floor(Math.random() * HEALTH_RM_ID_LIST.length);
			ownerId = HEALTH_RM_ID_LIST[randomIndex];
		}
		
		// Assign the payload
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

		if (existingLeadFlag) {
			await axios.post(
				ADD_ZOHO_INSURANCE_LEAD_URL,
				{ data: [{ id: leadId, ...leadPayload.data[0] }] },
				{ headers }
			);
			console.log("Updating the existing lead.");
		} else {
			const leadRes = await axios.post(ADD_ZOHO_INSURANCE_LEAD_URL, leadPayload, {
				headers,
			});
			leadId = leadRes.data?.data?.[0]?.id;
			if (!leadId) {
				throw new Error("Failed to get lead ID from fresh data.");
			} else {
				console.log("Fresh lead created. LeadId = ", leadId);
			}
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

module.exports = {
  submitLeadToCRM,
};
