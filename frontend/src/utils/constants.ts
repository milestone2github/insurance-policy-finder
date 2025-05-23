/** All URL and String Constants will come here **/

export const defaultProfilesMap = [
	{ profileType: "myself", label: "Myself", countable: false },
	{ profileType: "spouse", label: "Spouse", countable: false },
	{ profileType: "son", label: "Son", countable: true },
	{ profileType: "daughter", label: "Daughter", countable: true },
	{ profileType: "father", label: "Father", countable: false },
	{ profileType: "mother", label: "Mother", countable: false },
] as const;
