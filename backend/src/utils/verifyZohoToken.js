// Validates the Zoho-Id status -- must be Active and either Relationship Manager OR IT Desk

const axios = require("axios");

const verifyZohoToken = async (accessToken, rmId) => {
  try {
    console.log("Inside the rm verify function...");    // debug
    console.log(`imported params:- ${accessToken} and ${rmId}`); // debug
    const url = `https://people.zoho.com/api/forms/employee/getDataByID?recordId=${rmId}`;
    const res = await axios.get(
      url,
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    )
    const record = res.data.response?.result?.[0];
    // console.log(`verify Res:- ${record}`); // debug

    const empStatus = (record?.Employeestatus || "").toLowerCase();
    const dept = (record?.Department || "").toLowerCase();
    const designation = (record?.Designation || "").toLowerCase();

    // console.log(empStatus, dept, designation); // debug
    if (empStatus === "active" && (dept === "it desk" || designation === "relationship manager")) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Unable to check the token details: ", err);
    return;
  }
}

module.exports = verifyZohoToken;