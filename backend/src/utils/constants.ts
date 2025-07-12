export const ZOHO_TOKEN_EXTRACTION_URL = "https://accounts.zoho.com/oauth/v2/token";
export const CHECK_ZOHO_LEAD_URL = (id: string) => `https://www.zohoapis.com/crm/v5/Insurance_Leads/${id}`;
export const ADD_ZOHO_INSURANCE_LEAD_URL = "https://www.zohoapis.com/crm/v5/Insurance_Leads/upsert";
export const UPLOAD_LEAD_FILE_URL = "https://www.zohoapis.com/crm/v5/Insurance_Leads";