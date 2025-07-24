const ZOHO_TOKEN_EXTRACTION_URL = "https://accounts.zoho.com/oauth/v2/token";
const CHECK_ZOHO_LEAD_URL = (id) =>
  `https://www.zohoapis.com/crm/v5/Insurance_Leads/${id}`;
const ADD_ZOHO_INSURANCE_LEAD_URL =
  "https://www.zohoapis.com/crm/v5/Insurance_Leads/upsert";
const UPLOAD_LEAD_FILE_URL =
  "https://www.zohoapis.com/crm/v5/Insurance_Leads";

const WA_WATI_URL = (whatsappNumber) =>
	`https://live-mt-server.wati.io/302180/api/v1/sendTemplateMessage?whatsappNumber=${whatsappNumber}`;

// Randomized Owner ID List
const HEALTH_RM_ID_LIST = [
	"2969103000142839001", // Ishu Mavar
	"2969103000000183019", // Sagar Maini
	"2969103000438647001", // Sumit Chakraboty
	"2969103000154276001", // Sumit Sumit
	"2969103000193811001", // Yatin Munjal
	"2969103000500517001", // Rohit Bharadwaj
];

module.exports = {
  ZOHO_TOKEN_EXTRACTION_URL,
  CHECK_ZOHO_LEAD_URL,
  ADD_ZOHO_INSURANCE_LEAD_URL,
  UPLOAD_LEAD_FILE_URL,
  WA_WATI_URL,
  HEALTH_RM_ID_LIST
};
