import type { defaultProfilesMap } from "./constants";

// RootState interface (to handle preloadedState TS errors)
export interface PersistedAppStateInterface {
	profiles: ProfileState;
	personal: PersonalState;
	lifestyle: LifestyleState;
	medicalCondition: MedicalConditionState;
	existingPolicy: ExistingPolicyState;
}

// Option Card Prop
export type OptionCardProps = {
	label: string;
	selected: boolean;
	onClick: () => void;
};

export type Variant = "solid" | "outline" | "ghost";
export type Color = "green" | "blue" | "gray" | "darkblue" | "deepblue" | "red";

export interface SmallButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	variant?: Variant;
	color?: Color;
	className?: string;
}

// Profile Interfaces

// ProfileButton Interface
export interface ProfileButtonProps {
	profileType: ProfileType;
	profileKey?: string;
	label: string;
	selected: boolean;
	count?: number;
	onSelect: () => void;
	onCountChange?: (delta: number) => void;
	selectMode?: boolean;
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
		pincode: string;	// Pincode is also mandatory field
}
export interface PersonalState {
	personalInfo: Record<string, PersonalData>;
}


// Lifestyle types and interfaces
export type LifestyleOption = "Fit" | "Underweight" | "Overweight" | "Obese";

// ALCOHOL: frequency options after selecting consumer(s)
export type AlcoholFrequency = "Daily" | "Weekly" | "Occasionally" | "Rarely";

// TOBACCO: usage options after selecting consumer(s)
export type TobaccoUsage = "Under 5 Sticks/Packets" | "6 to 10 Sticks/Packets" | "Over 10 Sticks/Packets";

// // LifestyleData interface
export interface LifestyleData {
	profileType: ProfileType;
	index: number;
	fitness: LifestyleOption;
}

export interface AlcoholHistoryState {
	hasHistory: boolean;
	alcoholHistoryData?: Partial<Record<string, AlcoholFrequency>>;
}

export interface TobaccoHistoryState {
	hasHistory: boolean;
	tobaccoHistoryData?: Record<string, TobaccoUsage>;
}

// Payload for updating individual history values when hasHistory is true
export interface SetIndividualHistoryPayload<T> {
  profileType: string; // e.g., "myself", "father", "son-1"
  frequency?: T;
}

// Payload for setting the global "hasHistory" boolean
export interface SetHasHistoryPayload {
  substance: "alcohol" | "tobacco";
  hasHistory: boolean;
	alcoholHistoryData?: SetIndividualHistoryPayload<AlcoholFrequency | TobaccoUsage | undefined>;
}

export interface LifestyleState {
	lifestyleData: { [key: string]: LifestyleOption };
	alcoholHistory: AlcoholHistoryState;
	tobaccoHistory: TobaccoHistoryState;
}

export interface MedicalConditionState {
	activeQuestion: "medicalHistory" | "medicalTest" | "hospitalisation" | null;
	selectedProfiles: string[];
	// medicalData?: Record<string, string[]>;
	medicalData?: {
		[profileKey: string]: {
			selectedIllnesses?: string[];
			otherIllness?: string;
			hospitalisationYear?: string;
		};
	};
}


// Existing Policy Interfaces

export type PolicyType = 'individual' | 'floater';
export interface BasePolicyData {
	policyName: string,
	// coverAmount: number;
	coverAmount: string;
	otherName: string;
	renewalDate: string;
}

export interface IndividualPolicyData extends BasePolicyData {
	policyType: PolicyType;
	coverage: string;
}

export interface FloaterPolicyData extends BasePolicyData {
	policyType: PolicyType;
	coverage: string[];
}

// Can either be Individual or Floater
export type PolicyData = IndividualPolicyData | FloaterPolicyData;

export interface ExistingPolicyState {
	hasExistingPolicy: boolean;
	policyCount?: number;
	existingPolicyData?: { [key: string]: PolicyData };
}