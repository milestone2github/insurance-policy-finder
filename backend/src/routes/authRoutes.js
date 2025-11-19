const { Router } = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const verifyZohoToken = require("../utils/verifyZohoToken");

const authRoutes = Router();

authRoutes.get("/zoho", (req, res) => {
  const redirectUrl = req.query.redirect || process.env.DEFAULT_FRONTEND_URL;
	const state = encodeURIComponent(JSON.stringify({ redirectUrl }));
	const authUrl = "https://accounts.zoho.com/oauth/v2/auth"+
    `?response_type=code` +
    `&client_id=${process.env.ZOHO_CLIENT_ID}` +
    `&scope=profile,email,ZOHOPEOPLE.forms.READ` +
    `&redirect_uri=${process.env.ZOHO_REDIRECT_URI}` +
    `&access_type=offline` +
    `&prompt=consent` +  // tweak: only enable to manually force the zoho oauth to send refresh token
    `&state=${state}`;
	res.redirect(authUrl);
});

authRoutes.get("/zoho/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state ? JSON.parse(decodeURIComponent(req.query.state)) : {};
  const redirectUrl = state.redirectUrl || process.env.DEFAULT_FRONTEND_URL;

  try {  
    // Step 1: authorization code for access token
    const tokenResponse = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
			new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        code,
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

    // console.log("tokenResponse info ==> ", tokenResponse.data);    // debug
    const { access_token, refresh_token, id_token } = tokenResponse.data;
    const decodedJWT = jwt.decode(id_token);
    const userEmail = decodedJWT.email;
    
    if (!access_token) {
      throw new Error("Id token or Access Token not found");
    }

    if (!userEmail) {
      throw new Error("Email not found in decoded token");
    }

    // Fetch user details from Zoho People API by email
    const url = `https://people.zoho.com/api/forms/P_EmployeeView/records`;

    const peopleResponse = await axios.get(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
      },
      params: {
        searchColumn: "EMPLOYEEMAILALIAS",
        searchValue: userEmail,
      },
    });

    // console.log("incoming data ===> ", peopleResponse.data);  // debug

    if (!peopleResponse.data || !Array.isArray(peopleResponse.data) || peopleResponse.data.length === 0) {
      throw new Error(`Failed to fetch user details from Zoho People API for email: ${userEmail}`);
    }

    // Extract user details
    const zohoUser = peopleResponse.data[0]; // the first record is the user
    const role = (zohoUser["Title"] || "").toLowerCase();
    const dept = (zohoUser["Department"] || "").toLowerCase();
    const status = (zohoUser["Employee Status"] || "").toLowerCase();
    const rmId = zohoUser["recordId"] || "";  // check

    // console.log(`data: ${role}, ${dept}, ${status}, ${rmId}`); // debug

    if (!(role === "relationship manager" || dept === "it desk") && status === "active") {
      throw new Error("User is NOT an RM or NOT an Active member");
    }

    console.log("User is an RM, store token details in frontend");

    res.cookie(
			"zoho_auth",
			{
				access_token,
				refresh_token,
				expiry: Date.now() + 3600 * 1000, // 1 hour
				rmId,
			},
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === "production", // false on dev
				sameSite: "Lax",
				maxAge: 7 * 24 * 3600 * 1000, // 7 days
			}
		);
    
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error during authentication or fetching user details", error);
    return res.redirect(`${redirectUrl}/login?error=permissiondenied`);
  }
});

authRoutes.get("/zoho/getAccessToken", async (req, res) => {
  try {
    const cookie = req.cookies.zoho_auth;
    if (!cookie) return res.json({ isValid: false, isRM: false });

    let { access_token, refresh_token, expiry, rmId } = cookie;

    // Missing refresh token → cannot recover, force OAuth
    if (!refresh_token) {
      return res.json({ isValid: false, isRM: false });
    }

    // Refresh needed
    if (!access_token || Date.now() >= expiry) {
      const params = new URLSearchParams({
        refresh_token,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      });

      const refreshRes = await axios.post(
        "https://accounts.zoho.com/oauth/v2/token",
        params
      );

      access_token = refreshRes.data.access_token;
      if (!access_token) return res.json({ isValid: false, isRM: false });
    }

    // VALIDATE USER FIRST
    const isValidRM = await verifyZohoToken(access_token, rmId);

    if (!isValidRM) {
      return res.json({ isValid: false, isRM: false });
    }

    // Now safe to update cookie (if refreshed)
    res.cookie(
      "zoho_auth",
      {
        access_token,
        refresh_token,
        expiry: Date.now() + 3600 * 1000, // 1 hour
        rmId,
      },
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 3600 * 1000, // refresh token lifetime
      }
    );

    return res.json({
      isValid: true,
      isRM: true,
      rmId,
    });

  } catch (err) {
    console.log("error in get-accessToken:", err);
    return res.json({ isValid: false, isRM: false });
  }
});

authRoutes.get("/zoho/logout", (req, res) => {
	res.clearCookie("zoho_auth", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Lax",
	});

	return res.json({
		success: true,
		message: "Logged out from Zoho",
	});
});

module.exports = authRoutes;
// --------------------------------------------------------------------------------

// Check if ID is valid and active
// authRoutes.get('/zoho/check', async (req, res) => {
	// try {
  //   console.log("inside the check controller...");    // debug
  //   const cookie = req.cookies.zoho_auth;
  //   console.log("Cookies :-- ", req.cookies);   // debug
  //   if (!cookie) {
  //     console.log("Unable to parse cookies...");    // debug
  //     return res.json({ isValid: false, isRM: false });
  //   }

	// 	const { access_token: accessToken, refresh_token, expiry, rmId } = cookie;
  //   if (!accessToken) return res.json({ isValid: false, isRM: false });
		// Check the RM status in Zoho People records
		// const checkRM = await verifyZohoToken(accessToken, rmId);
		// if (!checkRM) return res.json({ isValid: false, isRM: false });

		// Check if token is expired
		// if (Date.now() < expiry) {
		// 	return res.json({ isValid: true, isRM: true });
		// }

		// Token expired → refresh it
		// const params = new URLSearchParams({
		// 	refresh_token,
		// 	client_id: process.env.ZOHO_CLIENT_ID,
		// 	client_secret: process.env.ZOHO_CLIENT_SECRET,
		// 	grant_type: "refresh_token",
		// });

		// const refreshResponse = await axios.post(
		// 	"https://accounts.zoho.com/oauth/v2/token",
		// 	params
		// );

		// const data = refreshResponse.data;
		// if (!data.access_token) {
    //   console.log("Access token not generated...", data);   // debug
		// 	return res.json({ isValid: false, isRM: false });
		// }

		// Update cookie
		// const newCookie = {
		// 	access_token: data.access_token,
		// 	refresh_token,
		// 	expiry: Date.now() + 3600 * 1000,
		// 	rmId,
		// };

		// res.cookie("zoho_auth", newCookie, {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === "production", // false on dev
		// 	sameSite: "Lax",
		// 	maxAge: 3600 * 1000,
		// });
    // console.log("Cookie Updated!");   // debug

		// return res.json({
		// 	isValid: true,
		// 	isRM: true,
		// });
// 	} catch (err) {
// 		console.log("error in /zoho/check:", err);
// 		return res.json({ isValid: false, isRM: false });
// 	}
// });



// ---
// Redundant callback code
    // if (!email) {
    //   throw new Error("Email not found in Zoho People API response");
    // }

    // Step 3: Check if user exists in our database
    // let userExist = await User.findOne({ email }).populate({path: "role", select: "name"});
    // let combinedPermissions;
    // let internalDashboardRole;

    // const setUserSession = (user) => {
    //   req.session.user = {
    //     name: user.name || `${zohoUser['First Name']} ${zohoUser['Last Name']}`.trim(),
    //     email: user.email,
    //     mintUsername: user.mintUsername,
    //     insuranceDashboardID: user.insuranceDashboardID,
    //     role: { _id: user?.role?._id, name: user.role ? user.role.name : null }, // Include role name if available
    //     permissions: combinedPermissions,
    //     internalDashboardRole: internalDashboardRole,
    //     access_token,
    //     refresh_token
    //   };
    // };

    // if (userExist) {

    //  // Latest Sync with Zoho for Updated Role and Depaertment
    //   const currDate = new Date();
    //   const lastSyncDate = new Date(userExist.lastSyncedWithZoho || 0);
    //   const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

    //   // Runs Only if last synced with zoho greater then 30 days
    //   if (currDate - lastSyncDate > thirtyDaysInMs) {
    //     const latestDeptName = zohoUser.Department;
    //     const latestRoleName = zohoUser.Title;

    //     let updatedDept = await Department.findOne({ name: latestDeptName });
    //     if (!updatedDept) {
    //       updatedDept = await Department.create({ name: latestDeptName });
    //       // console.log(`[SYNC] Created new department: "${latestDeptName}" with ID ${updatedDept._id}`);
    //     }

    //     let updatedRole = await Role.findOne({ name: latestRoleName });
    //     if (!updatedRole) {
    //       updatedRole = await Role.create({ name: latestRoleName });
    //       // console.log(`[SYNC] Created new role: "${latestRoleName}" with ID ${updatedRole._id}`);
    //     }

    //     let updated = false;

    //     if (!userExist.department.equals(updatedDept._id)) {
    //       userExist.department = updatedDept._id;
    //       updated = true;
    //       // console.log(`[SYNC] Department changed for ${email}: ${userExist.department} → ${updatedDept._id}`);
    //     }

    //     if (!userExist.role.equals(updatedRole._id)) {
    //       userExist.role = updatedRole._id;
    //       updated = true;
    //       // console.log(`[SYNC] Role changed for ${email}: ${userExist.role} → ${updatedRole._id}`);
    //     }

    //     if (updated) {
    //       // console.log(`[SYNC] Updated user ${email} with new department and/or role. Syncing now -(promotion/transfer detected)`);
    //       userExist.lastSyncedWithZoho = currDate;
    //       await userExist.save();
    //     } else {
    //       // console.log(`[SYNC] No changes in department or role for ${email}. Just updating last sync timestamp.`);
    //       userExist.lastSyncedWithZoho = currDate;
    //       await userExist.save();
    //     }
    //   }
    
    // Step 4: If user exists, set session & redirect

      //combinedPermissions(role + department + user additional)  
    //   combinedPermissions = await getCombinedPermissions(userExist);
    //   internalDashboardRole = userExist.internalDashboardRole;

    //   setUserSession(userExist);

    //   // console.log("Session Set (Existing User):", req.session);
    //   return res.redirect(redirectUrl);
    // }

    // // Step 5: If user does NOT exist, fetch department & role details
    // //--Check or create department and role if not in database
    // let department = await Department.findOne({ name: zohoUser.Department });

    // if (!department) {
    //   department = await Department.create({ name: zohoUser.Department });
    //   // console.log("Created new department:", department);
    // }

    // let role = await Role.findOne({ name: zohoUser.Title });

    // if (!role) {
    //   role = await Role.create({ name: zohoUser.Title, department: department._id });
    //   // console.log("Created new role:", role);
    //   // console.log(`[ROLE-CREATE] New role "${role.name}" created under department "${department.name}" with ID ${role._id}`);
    // }

    // // Step 6: Create new user in the database
    // const newUser = new User({
    //   email: email,
    //   name: `${zohoUser['First Name']} ${zohoUser['Last Name']}`.trim(),
    //   mintUsername: zohoUser.mintUsername || null,
    //   insuranceDashboardID: zohoUser.insuranceDashboardID || null,
    //   department: department._id,
    //   role: role._id,
    //   status: 'active',
    //   internalDashboardRole: zohoUser.internalDashboardRole || "",
    //   lastSyncedWithZoho: new Date()
    // });

    // await newUser.save();
    // await newUser.populate('role'); // Populate the newly created role
    // internalDashboardRole = newUser.internalDashboardRole;

    // Step 7: Set session & redirect new user


    {/* In case of new user if fresh depart and role created it might be possible combinedPermissions could be 
      empty(to be have permission, the depart and role must already exist in database with permission) 
      In that note it will create new user with  permission */}

    // combinedPermissions(role + department + user additional) 
    // combinedPermissions = await getCombinedPermissions(newUser);

    // setUserSession(newUser);

    // console.log("New User Created & Session Set:", req.session); // Debug

    // return res.redirect(redirectUrl);

