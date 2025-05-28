import type { defaultProfilesMap } from "./constants";

// RootState interface (to handle preloadedState TS errors)
export interface PersistedAppStateInterface {
	profiles: ProfileState;
	personal: PersonalState;
	lifestyle: LifestyleState;
	// medicalCondition: MedicalConditionState;
	existingPolicy: ExistingPolicyState;
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
		pincode?: string;
}
export interface PersonalState {
	personalInfo: Record<string, PersonalData>;
}

// Personal State (individually defined to incorporate logic for catering fields for each son/daughter)
// export interface PersonalState {
// 	personalInfo: {
// 		// myself?: PersonalData;
// 		// spouse?: PersonalData;
// 		// // son?: PersonalData[];
// 		// // daughter?: PersonalData[];
// 		// son?: Record<string, PersonalData>;
// 		// daughter?: Record<string, PersonalData>;
// 		// father?: PersonalData;
// 		// mother?: PersonalData;
// 	};
// }


// Lifestyle types and interfaces
export type LifestyleOption = "Fit" | "Underweight" | "Overweight" | "Obese";

// ALCOHOL: frequency options after selecting consumer(s)
export type AlcoholFrequency = "Daily" | "Weekly" | "Occasionally" | "Rarely";

// TOBACCO: usage options after selecting consumer(s)
export type TobaccoUsage = "Under 5 units" | "6 to 10 units" | "Over 10 units";

// // LifestyleData interface
export interface LifestyleData {
	profileType: ProfileType;
	index: number;
	fitness: LifestyleOption;
}

/*************/
// OLD STRUCTURE
// Lifestyle history interfaces (AlcoholHistory and TobaccoHistory)
// export interface IndividualHistory<T> {
// 	hasHistory: boolean;
// 	frequency?: T;
// }
// export type ChildrenHistory<T> = Record<string, IndividualHistory<T>>;
// export interface FamilyHistory<T> {
// 	myself?: IndividualHistory<T>;
// 	father?: IndividualHistory<T>;
// 	mother?: IndividualHistory<T>;
// 	spouse?: IndividualHistory<T>;
// 	son?: ChildrenHistory<T>;
// 	daughter?: ChildrenHistory<T>;
// }

// Main State interface
// export interface LifestyleState {
// 	lifestyleData: { [key: string]: LifestyleOption | LifestyleOption[] };
// 	alcoholHistory: FamilyHistory<AlcoholFrequency>;
// 	tobaccoHistory: FamilyHistory<TobaccoUsage>;
// }
/*****************/

export interface AlcoholHistoryState {
	hasHistory: boolean;
	// alcoholHistoryData?: Record<string, AlcoholFrequency>;
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
	// lifestyleData: { [key: string]: LifestyleOption | LifestyleOption[] };
	lifestyleData: { [key: string]: LifestyleOption };
	alcoholHistory: AlcoholHistoryState;
	tobaccoHistory: TobaccoHistoryState;
}

// // Interface to set alcoholHistory and tobaccoHistory data
// export interface SetHistoryPayload<T> {
// 	profileType: ProfileType; // e.g., "myself", "father", "son", "daughter"
// 	key?: string; // e.g., "son-1", "daughter-2" → only for children
// 	data: IndividualHistory<T>;
// }

export interface ExistingPolicyState {
	hasExistingPolicy: boolean;
	existingPolicyData: {};
}