import type { defaultProfilesMap } from "./constants";

// RootState interface (to handle preloadedState TS errors)
export interface PersistedAppStateInterface {
	profiles: ProfileState;
	personal: PersonalState;
	lifestyle: LifestyleState;
}


// Profile Interfaces

// ProfileButton Interface
export interface ProfileButtonProps {
	profileType: ProfileType;
	label: string;
	selected: boolean;
	count?: number;
	onSelect: () => void;
	onCountChange?: (delta: number) => void;
}

/*** PROFILE SELECTION MAPPING (based on initial data in constants.ts) ***/
export type ProfileType = (typeof defaultProfilesMap)[number]["profileType"];

// Other required fields for Profile Selection on 1st page
export interface ProfileData {
	label: string;
	selected: boolean;
	count: number;
	countable: boolean;
}

export interface ProfileState {
	profileData: Record<ProfileType, ProfileData>;
}


/*** Personal Input form ***/
export interface PersonalData {
		name: string;
		dob: string;
		gender: string;
		pincode?: string;
}

// Personal State (individually defined to incorporate logic for catering fields for each son/daughter)
export interface PersonalState {
	personalInfo: {
		myself?: PersonalData;
		spouse?: PersonalData;
		son?: PersonalData[];
		daughter?: PersonalData[];
		father?: PersonalData;
		mother?: PersonalData;
	};
}


// Lifestyle types and interfaces
export type LifestyleOption = "Fit" | "Underweight" | "Overweight" | "Obese";

export interface LifestyleData {
	profileType: ProfileType;
	index: number;
	fitness: LifestyleOption;
}

export interface LifestyleState {
	lifestyleData: {
		[key: string]: LifestyleOption | LifestyleOption[];
	};
}
