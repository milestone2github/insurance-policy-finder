const LOCAL_STORAGE_KEY = "insuranceFormData";

// Fetch JSON data from localstorage if available
export function getStoredAppData() {
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : {};

		// Ensure only valid values are passed to preloadState
		const hasProfileData =
			parsed?.profiles?.profileData &&
			Object.keys(parsed.profiles.profileData).length > 0;

		const hasPersonalData =
			parsed?.personal?.personalInfo &&
			Object.keys(parsed.personal.personalInfo).length > 0;

		const hasLifestyleData =
			parsed?.lifestyle?.lifestyleData &&
			Object.keys(parsed.lifestyle.lifestyleData).length > 0;

		const hasMedicalConditionData =
			parsed?.medicalCondition?.activeQuestion &&
			Array.isArray(parsed.medicalCondition.selectedProfiles) &&
			parsed.medicalCondition.selectedProfiles.length > 0 &&
			parsed.medicalCondition.medicalData &&
			Object.keys(parsed.medicalCondition.medicalData).length > 0;

		const hasExistingPolicyData =
		parsed?.existingPolicy?.hasExistingPolicy &&
		Object.keys(parsed.existingPolicy.existingPolicyData).length > 0;

		return {
			profiles: hasProfileData
				? { profileData: parsed.profiles.profileData }
				: undefined,

			personal: hasPersonalData
				? { personalInfo: parsed.personal.personalInfo }
				: undefined,

			lifestyle: hasLifestyleData
				? {
						lifestyleData: parsed.lifestyle.lifestyleData,
						alcoholHistory: {
							hasHistory: parsed.lifestyle.alcoholHistory.hasHistory,
							alcoholHistoryData:
								parsed.lifestyle.alcoholHistory.alcoholHistoryData,
						},
						tobaccoHistory: {
							hasHistory: parsed.lifestyle.tobaccoHistory.hasHistory,
							tobaccoHistoryData:
								parsed.lifestyle.tobaccoHistory.tobaccoHistoryData,
						},
				  }
				: undefined,

			medicalCondition: hasMedicalConditionData
				? {
						activeQuestion: parsed.medicalCondition.activeQuestion,
						selectedProfiles: parsed.medicalCondition.selectedProfiles,
						medicalData: parsed.medicalCondition.medicalData
				  }
				: undefined,

			existingPolicy: hasExistingPolicyData
				? {
						hasExistingPolicy: parsed.existingPolicy.hasExistingPolicy,
						policyCount: parsed.existingPolicy.policyCount,
						existingPolicyData: parsed.existingPolicy.existingPolicyData,
				  }
				: undefined,
		};
	} catch (err) {
		console.error("Error loading persisted state:", err);
		return {};
	}
}

// Set the data in localstorage
// export const setStoredAppData = (data) => {
// 	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
// };

// Fetch data from localstorage and update the fields as per latest state
export function updateAppData(key, data) {
	try {
		const existing = getStoredAppData();
		const updated = { ...existing, [key]: data };
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
	} catch (err) {
		console.error("Error updating localStorage:", err);
	}
}