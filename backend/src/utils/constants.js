const ZOHO_TOKEN_EXTRACTION_URL = "https://accounts.zoho.com/oauth/v2/token";
const CHECK_ZOHO_LEAD_URL = (id) =>
  `https://www.zohoapis.com/crm/v5/Insurance_Leads/${id}`;
const ADD_ZOHO_INSURANCE_LEAD_URL =
  "https://www.zohoapis.com/crm/v5/Insurance_Leads/upsert";
const UPLOAD_LEAD_FILE_URL =
  "https://www.zohoapis.com/crm/v5/Insurance_Leads";

module.exports = {
  ZOHO_TOKEN_EXTRACTION_URL,
  CHECK_ZOHO_LEAD_URL,
  ADD_ZOHO_INSURANCE_LEAD_URL,
  UPLOAD_LEAD_FILE_URL,
};
