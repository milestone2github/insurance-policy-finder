import axios from "axios";
import { getStoredAppData } from "./persistence";

export async function sendDataToDb(step, progressPercent, isOpened=undefined, entryType=undefined) {
	// console.log("entryType start ----> ", entryType);		// debug
	// To-Do: ADD the checks of a valid RM (from fields in localstorage) and specify the entrytype based on that
	try {
		const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
		const isRMFlag = localStorage.getItem("isRM") === "true";
		const rmId = localStorage.getItem("rmId");

		// console.log("Rounded Progress ==> ", progressPercent);  // debug
		const roundedProgress = Math.round(progressPercent / 10) * 10;
		// stop the process if no authToken found
		const authToken = localStorage.getItem("authToken");
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

		// Check if user opened the page ; also creates the Lead collection entry (generates leadId)
		if (isOpened !== undefined) {
			payload.isOpened = isOpened;
		}

		// define the type of lead
		if (entryType && entryType === "direct") {
			payload.entryType = "direct";
		} else if ((entryType && entryType === "rm_assist") || (isRMFlag && rmId)) {
			payload.entryType = "rm_assist";
		} else if (entryType && entryType === "ads") {
			payload.entryType = "ads";
		}

		await axios.post(`${baseUrl}/api/insurance-form`, payload, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		}).then((res) => {
			if (!res) {
				console.error("Unable to update DB");
				return;
			}
			// else if (res.data.success === true && res.data.leadDetails) {
			// 	localStorage.setItem(
			// 		"leadDetails",
			// 		JSON.stringify({
			// 			...lead,
			// 			lead_id: res.data?.leadDetails?.leadId,
			// 		})
			// 	);
			// }
		});
		// console.log("DB sync success", res.data);  // debug
	} catch (err) {
		console.error("DB sync failed:", err);
	}
}
