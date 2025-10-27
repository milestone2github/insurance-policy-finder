import axios from "axios";
import { getStoredAppData } from "./persistence";

export async function sendDataToDb(step, progressPercent, entryType, isOpened=undefined) {
	try {
		const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
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
		if (entryType.toLowerCase() === "direct") {
			payload.entryType = "direct";
		} else {
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
