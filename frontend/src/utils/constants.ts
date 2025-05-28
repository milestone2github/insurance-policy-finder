/** All URL and String Constants will come here **/

import type { ProfileType } from "./interfaces";

// Initial Profile Data
export const defaultProfilesMap = [
	{ profileType: "myself", label: "Myself", countable: false },
	{ profileType: "spouse", label: "Spouse", countable: false },
	{ profileType: "son", label: "Son", countable: true },
	{ profileType: "daughter", label: "Daughter", countable: true },
	{ profileType: "father", label: "Father", countable: false },
	{ profileType: "mother", label: "Mother", countable: false },
] as const;


// Available Gender Options
export const genderOptions: Record<ProfileType, string[]> = {
	father: ["male"],
	mother: ["female"],
	son: ["male"],
	daughter: ["female"],
	myself: ["male", "female", "other"],
	spouse: ["male", "female", "other"],
};

// Profile Labels: used in Personal component
export const PROFILE_LABELS = Object.fromEntries(
	defaultProfilesMap.map(({ profileType, label }) => [profileType, label])
);