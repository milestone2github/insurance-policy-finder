const axios = require("axios");
const FormData = require("form-data");
// const Lead = require("../database/models/Lead");
const {
  ADD_ZOHO_INSURANCE_LEAD_URL,
  CHECK_ZOHO_LEAD_URL,
  CHECK_ZOHO_LEAD_VIA_PHONE,
  UPLOAD_LEAD_FILE_URL,
  ZOHO_TOKEN_EXTRACTION_URL,
  HEALTH_RM_ID_LIST,
} = require("./constants");
const InsuranceForm = require("../database/models/InsuranceForm");

async function submitLeadToCRM(data) {
  try {
    const { contactNumber, name, leadId, uploadedFile } = data;

    if (!contactNumber) throw new Error("Contact Number not provided");
    if (!uploadedFile) throw new Error("No file uploaded");
    if (!leadId) console.warn("Lead Id not provided");

    // Get Zoho token
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
    console.log("Access Token debug: ", token);	// debug

    const headers = {
      Authorization: `Zoho-oauthtoken ${token}`,
    };

    let ownerId = "";
    let crmLeadId = "";
    let leadName = "";
    let existingLeadFlag = false;

    // Search the CRM using given leadId
    if (leadId) {
      const searchLeadRes = await axios.get(CHECK_ZOHO_LEAD_URL(leadId), { headers });
      if (searchLeadRes.data?.data?.[0]) {
				ownerId = searchLeadRes.data?.data?.[0]?.Owner.id;
				crmLeadId = searchLeadRes.data?.data?.[0]?.id;
				leadName = searchLeadRes.data?.data?.[0]?.Name;
				existingLeadFlag = true;
				console.log("Lead exists in CRM");
			}
    }

    // Check Lead in CRM using phone
    if (!existingLeadFlag) {
      const phoneLeadRes = await axios.get(CHECK_ZOHO_LEAD_VIA_PHONE(contactNumber), { headers } );
      if (phoneLeadRes.data?.data?.[0]) {
				ownerId = phoneLeadRes.data?.data?.[0]?.Owner.id; // fetch owner id (RM) from existing lead
				crmLeadId = phoneLeadRes.data?.data?.[0]?.id;
				leadName = phoneLeadRes.data?.data?.[0]?.Name;
				console.log(`Lead exists in CRM. Owner Id = ${ownerId}, CRM Lead Id = ${crmLeadId}`); // debug
				existingLeadFlag = true;
			}
    }

    // Assign random OwnerId (RM-id) to create new entry in CRM
    if (!existingLeadFlag) {
      console.log("Lead doesn't exist. Creating a new one & assigning an OwnerId...");
			const randomIndex = Math.floor(Math.random() * HEALTH_RM_ID_LIST.length);
			ownerId = HEALTH_RM_ID_LIST[randomIndex];
      console.log(`Assigned OwnerId: ${ownerId}`); // debug
    }

    // Add the name if lead exist in CRM but don't have a Name (may happen if lead inserted in CRM from azure-worker-functions)
    if (!leadName && existingLeadFlag) {
      await axios.post(
        ADD_ZOHO_INSURANCE_LEAD_URL,
        { data: [{ id: crmLeadId, Name: name, Product: "Health Insurance" }] },
        { headers }
      );
      console.log("Updating the existing lead in Zoho CRM");
    }
    
    // Lead doesn't exist in CRM, Assign the payload
    if (ownerId && !crmLeadId && !existingLeadFlag) {
      const leadPayload = {
        data: [{
          Name: name,
          Phone: contactNumber,
          Owner: { id: ownerId },
          Product: "Health Insurance",
        }],
      };
  
      // Create New Lead entry in CRM
      const response = await axios.post(
        ADD_ZOHO_INSURANCE_LEAD_URL,
        leadPayload,
        { headers }
      );

      crmLeadId = response.data?.data?.[0]?.id; // fetch CRM-generated leadId
    }

    if (!crmLeadId) {
      throw new Error("Zoho did not return Lead ID");
    }

    // Prepare and upload PDF
    const form = new FormData();
    form.append("file", uploadedFile.buffer, {
      filename: "Insurance_Review.pdf",
      contentType: uploadedFile.mimetype,
    });

    // Upload the PDF blob to CRM
    await axios.post(`${UPLOAD_LEAD_FILE_URL}/${crmLeadId}/Attachments`, form, {
      headers: {
        ...form.getHeaders(), // Multipart-headers
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    // Upload the PDF blob in MongoDB
    const leadRes = await InsuranceForm.findOneAndUpdate(
			{ contactNumber },
			{
        leadId: crmLeadId,
        ownerId,
				file: {
					data: uploadedFile.buffer,
					contentType: uploadedFile.mimetype,
				},
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

    if (!leadRes) {
      console.error("Failed to upload the file to mongoDB");
    } else {
      console.log("PDF uploaded successfully.");
    }
    return crmLeadId;
  } catch (err) {
    console.error("Lead submission failed:", err);
    throw err;
  }
}

module.exports = {
  submitLeadToCRM,
};
