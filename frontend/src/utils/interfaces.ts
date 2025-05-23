import type { defaultProfilesMap } from "./constants";

// ProfileButton Interface
export interface ProfileButtonProps {
	profileType: ProfileType;
	label: string;
	selected: boolean;
	count?: number;
	onSelect: () => void;
	onCountChange?: (delta: number) => void;
}

// Profile Interfaces
/*** PROFILE SELECTION MAPPING ***/
export type ProfileType = (typeof defaultProfilesMap)[number]["profileType"];

export interface ProfileData {
	label: string;
	selected: boolean;
	count: number;
	countable: boolean;
}

export interface ProfileSelectionState {
	profiles: Record<ProfileType, ProfileData>;
}


/*** Personal Input form ***/
export interface PersonalData {
		name: string;
		dob: string;
		gender: string;
		pincode?: string;
}

export interface PersonalState {
	personalDetails: Partial<Record<ProfileType, PersonalData>>;
}
