import axios from "axios";
import { getStoredAppData } from "./persistence";

export async function sendDataToDb(step, progressPercent, isOpened=undefined) {
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

		// Check if user opened the page
		if (isOpened !== undefined) {
			payload.isOpened = isOpened;
		}

		const res = await axios.post(`${baseUrl}/api/insurance-form`, payload, {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		});

		// console.log("DB sync success", res.data);  // debug
	} catch (err) {
		console.error("DB sync failed:", err);
	}
}
