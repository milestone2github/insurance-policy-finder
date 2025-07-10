export const ZOHO_TOKEN_EXTRACTION_URL = "https://accounts.zoho.com/oauth/v2/token";
export const CHECK_ZOHO_LEAD_URL = (phone: string) => `https://www.zohoapis.com/crm/v2/Investment_leads/search?criteria=(Mobile:equals:${phone})`;
// export const ADD_ZOHO_INVESTMENT_LEAD_URL = "https://www.zohoapis.com/crm/v2/Investment_leads";
export const ADD_ZOHO_INSURANCE_LEAD_URL = "https://www.zohoapis.com/crm/v5/Insurance_Leads/upsert";