/** All URL and String Constants will come here **/

import SelfIcon from "../assets/icons/SelfIcon.png";
import SpouseIcon from "../assets/icons/SpouseIcon.png";
import FatherIcon from "../assets/icons/FatherIcon.png";
import MotherIcon from "../assets/icons/MotherIcon.png";
import SonIcon from "../assets/icons/SonIcon.png";
import DaughterIcon from "../assets/icons/DaughterIcon.png";


// Icon mapping
export const iconMap = {
	myself: SelfIcon,
	spouse: SpouseIcon,
	son: SonIcon,
	daughter: DaughterIcon,
	father: FatherIcon,
	mother: MotherIcon,
	grandfather: FatherIcon,
	grandmother: MotherIcon,
	fatherInLaw: FatherIcon,
	motherInLaw: MotherIcon,
};

// Initial Profile Data
export const defaultProfilesMap = [
	{ profileType: "myself", label: "Myself", countable: false },
	{ profileType: "spouse", label: "Spouse", countable: false },
	{ profileType: "son", label: "Son", countable: true },
	{ profileType: "daughter", label: "Daughter", countable: true },
	{ profileType: "father", label: "Father", countable: false },
	{ profileType: "mother", label: "Mother", countable: false },
	{ profileType: "grandfather", label: "Grandfather", countable: true },
	{ profileType: "grandmother", label: "Grandmother", countable: true },
	{ profileType: "fatherInLaw", label: "Father-in-Law", countable: false },
	{ profileType: "motherInLaw", label: "Mother-in-Law", countable: false },
];


// Available Gender Options
export const genderOptions = {
	father: ["male"],
	mother: ["female"],
	son: ["male"],
	daughter: ["female"],
	myself: ["male", "female", "other"],
	spouse: ["male", "female", "other"],
	grandfather: ["male"],
	grandmother: ["female"],
	fatherInLaw: ["male"],
	motherInLaw: ["female"],
};

// Profile Labels: used in Personal component
export const PROFILE_LABELS = Object.fromEntries(
	defaultProfilesMap.map(({ profileType, label }) => [profileType, label])
);

// Navlink Steps
export const steps = [
	{ label: "Personal", path: "/", progress: 0 },
	{ label: "Lifestyle", path: "/lifestyle", progress: 20 },
	{ label: "Medical/health Conditions", path: "/medical-history", progress: 40 },
	{ label: "Existing policy", path: "/policies", progress: 60 },
	{ label: "Review", path: "/review", progress: 80 },
];

// Grouped substeps under main sections
export const stepGroups = [
	{
		main: "Personal",
		paths: ["/", "/personal/input-names"],
	},
	{
		main: "Lifestyle",
		paths: [
			"/lifestyle",
			"/lifestyle/habit-history-1",
			"/lifestyle/habit-history-1/frequency",
			"/lifestyle/habit-history-2",
			"/lifestyle/habit-history-2/usage",
		],
	},
	{
		main: "Medical",
		paths: [
			"/medical-history",
			"/medical/test-history",
			"/medical/hospitalisation",
			"/medical/data",
		],
	},
	{
		main: "Policies",
		paths: ["/policies", "/policies/info"],
	},
	{
		main: "Review",
		paths: ["/review"],
	},
];
