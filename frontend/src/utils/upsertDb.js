import axios from "axios";
import { getStoredAppData } from "./persistence";

export async function sendDataToDb(step, progressPercent, isOpened=undefined) {
	try {
		const baseUrl = import.meta.env.VITE_API_BASE_URL;
		console.log("Rounded Progress ==> ", progressPercent);
		const roundedProgress = Math.round(progressPercent / 10) * 10;
		
		/*	// REDUNDANT CODE : CONTACTNUMBER IS REPLACED WITH JWT TOKEN
		// let contactNumber = localStorage.getItem("contactNumber");
		// const leadDetails = JSON.parse(localStorage.getItem("leadDetails" || "{}"));

		// Contact Number not found in URL params but in localStorage
		if (!contactNumber && leadDetails.phone) {
			contactNumber = leadDetails.phone;
			localStorage.setItem("contactNumber", contactNumber);
		}

		// Contact Number not found in localstorage but OTP is verified:
		if (!contactNumber && step === 6 && leadDetails.phone) {
			contactNumber = leadDetails.phone;
			localStorage.setItem("contactNumber", contactNumber);
		}

		// If still missing and not step 6 → stop
		if (!contactNumber) {
			console.warn("No contact number available. Skipping DB update at step: ", step);
			return;
			}
			*/
			
		// stop the process if no authToken found
		const authToken = localStorage.getItem("authToken" || "");
		if (!authToken) {
			console.warn("No token available. Skipping DB update at step: ", step);
			return;
		}

		const storedData = getStoredAppData();

		const payload = {
			...storedData,
			progress: roundedProgress,
			currentStep: step,
		};

		// Check if user opened the page
		if (isOpened !== undefined) {
			payload.isOpened = isOpened;
		}

		// const res = await axios.post(
		// 	`${baseUrl}/api/insurance-form/${contactNumber}`,
		// 	payload
		// );

		const res = await axios.post(`${baseUrl}/api/insurance-form`, payload, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});

		console.log("DB sync success:", res.data);
	} catch (err) {
		console.error("DB sync failed:", err);
	}
}
