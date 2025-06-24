/** All URL and String Constants will come here **/

import type { ProfileType } from "./interfaces";
import SelfIcon from "../assets/icons/SelfIcon.png";
import SpouseIcon from "../assets/icons/SpouseIcon.png";
import FatherIcon from "../assets/icons/FatherIcon.png";
import MotherIcon from "../assets/icons/MotherIcon.png";
import SonIcon from "../assets/icons/SonIcon.png";
import DaughterIcon from "../assets/icons/DaughterIcon.png";


// Icon mapping
export const iconMap: Record<ProfileType, string> = {
	myself: SelfIcon,
	spouse: SpouseIcon,
	son: SonIcon,
	daughter: DaughterIcon,
	father: FatherIcon,
	mother: MotherIcon,
};

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

// Navlink Steps
export const steps = [
	{ label: "Personal", path: "/" },
	{ label: "Lifestyle", path: "/lifestyle" },
	{ label: "Medical/health Conditions", path: "/medical-history" },
	{ label: "Existing policy", path: "/policies" },
	{ label: "Review", path: "/review" },
];