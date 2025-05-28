import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
	LifestyleData,
	LifestyleOption,
	AlcoholFrequency,
	TobaccoUsage,
	SetIndividualHistoryPayload,
	SetHasHistoryPayload,
	LifestyleState,
} from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";



// Load initial state from insuranceFormData
const storedAppData = getStoredAppData();
const initialState: LifestyleState = storedAppData.lifestyle || {
	lifestyleData: {},
	alcoholHistory: { hasHistory: false },
	tobaccoHistory: { hasHistory: false },
};

const lifestyleSlice = createSlice({
	name: "lifestyle",
	initialState,
	reducers: {
		// setLifestyleData: (state, action: PayloadAction<LifestyleData>) => {
		// 	const { profileType, index, fitness } = action.payload;
		// 	const isChild = profileType === "son" || profileType === "daughter";

		// 	if (isChild) {
		// 		const arr = (state.lifestyleData[profileType] ??
		// 			[]) as LifestyleOption[];
		// 		arr[index] = fitness;
		// 		state.lifestyleData[profileType] = arr;
		// 	} else {
		// 		state.lifestyleData[profileType] = fitness;
		// 	}

		// 	updateAppData("lifestyle", state);
		// },
		setLifestyleData: (state, action: PayloadAction<LifestyleData>) => {
			const { profileType, index, fitness } = action.payload;

			// Construct unique profileKey like 'son-1', 'daughter-2', etc.
			const profileKey =
				profileType === "son" || profileType === "daughter"
					? `${profileType}-${index + 1}`
					: profileType;

			state.lifestyleData[profileKey] = fitness;

			updateAppData("lifestyle", state);
		},

		// setAlcoholHistory: (
		// 	state,
		// 	action: PayloadAction<SetHistoryPayload<AlcoholFrequency>>
		// ) => {
		// 	const { profileType, key, data } = action.payload;
		// 	if (profileType === "son" || profileType === "daughter") {
		// 		if (!state.alcoholHistory[profileType]) {
		// 			state.alcoholHistory[profileType] = {};
		// 		}
		// 		if (key) {
		// 			state.alcoholHistory[profileType]![key] = data;
		// 		}
		// 	} else {
		// 		state.alcoholHistory[profileType] = data;
		// 	}
		// },

		// setTobaccoHistory: (
		// 	state,
		// 	action: PayloadAction<SetHistoryPayload<TobaccoUsage>>
		// ) => {
		// 	const { profileType, key, data } = action.payload;
		// 	if (profileType === "son" || profileType === "daughter") {
		// 		if (!state.tobaccoHistory[profileType]) {
		// 			state.tobaccoHistory[profileType] = {};
		// 		}
		// 		if (key) {
		// 			state.tobaccoHistory[profileType]![key] = data;
		// 		}
		// 	} else {
		// 		state.tobaccoHistory[profileType] = data;
		// 	}
		// },

		// setFullLifestyleData: (
		// 	state,
		// 	action: PayloadAction<{
		// 		[key: string]: LifestyleOption | LifestyleOption[];
		// 	}>
		// ) => {
		// 	state.lifestyleData = action.payload;
		// 	updateAppData("lifestyle", state);
		// },

		setFullLifestyleData: (
			state,
			action: PayloadAction<{ [key: string]: LifestyleOption }>
		) => {
			state.lifestyleData = action.payload;
			updateAppData("lifestyle", state);
		},

		// set hasHistory for alcohol or tobacco
		setHasHistory: (state, action: PayloadAction<SetHasHistoryPayload>) => {
			const { substance, hasHistory } = action.payload;
			if (substance === "alcohol") {
				state.alcoholHistory = { hasHistory };
			} else {
				state.tobaccoHistory = { hasHistory };
			}
			updateAppData("lifestyle", state);
		},

		// set individual alcohol frequency only if hasHistory is true
		setAlcoholHistory: (
			state,
			action: PayloadAction<SetIndividualHistoryPayload<AlcoholFrequency>>
		) => {
			if (!state.alcoholHistory.hasHistory) return;

			const { profileType, frequency } = action.payload;
			if (!state.alcoholHistory.alcoholHistoryData) {
				state.alcoholHistory.alcoholHistoryData = {};
			}
			// if (!frequency) {
			// 	state.alcoholHistory.alcoholHistoryData[profileKey] = undefined;
			// }
			// state.alcoholHistory.alcoholHistoryData[profileKey] = frequency;

			// if (frequency !== undefined) {
			// 	state.alcoholHistory.alcoholHistoryData[profileType] = frequency;
			// } else {
			// 	// state.alcoholHistory.alcoholHistoryData[profileKey] = undefined;
			// 	state.alcoholHistory.alcoholHistoryData[profileType] = null;
			// }

			if (frequency !== undefined) {
				state.alcoholHistory.alcoholHistoryData[profileType] = frequency;
			} else {
				state.alcoholHistory.alcoholHistoryData[profileType] = null as unknown as AlcoholFrequency;
			}

			updateAppData("lifestyle", state);
		},

		// set individual tobacco frequency only if hasHistory is true
		setTobaccoHistory: (
			state,
			action: PayloadAction<SetIndividualHistoryPayload<TobaccoUsage>>
		) => {
			if (!state.tobaccoHistory.hasHistory) return;

			const { profileType, frequency } = action.payload;
			if (!state.tobaccoHistory.tobaccoHistoryData) {
				state.tobaccoHistory.tobaccoHistoryData = {};
			}
			// state.tobaccoHistory.tobaccoHistoryData[profileKey] = frequency;
			// if (frequency !== undefined) {
			// 	state.tobaccoHistory.tobaccoHistoryData[profileType] = frequency;
			// } else {
			// 	state.tobaccoHistory.tobaccoHistoryData[profileType] = null;
			// }

			if (frequency !== undefined) {
				state.tobaccoHistory.tobaccoHistoryData[profileType] = frequency;
			} else {
				state.tobaccoHistory.tobaccoHistoryData[profileType] = null as unknown as TobaccoUsage;
			}

			updateAppData("lifestyle", state);
		},

		resetAlcoholHistory: (state, action: PayloadAction<string>) => {
			const key = action.payload;
			delete state.alcoholHistory.alcoholHistoryData![key];
			updateAppData("lifestyle", state);
		},

		resetTobaccoHistory: (state, action: PayloadAction<string>) => {
			const key = action.payload;
			delete state.tobaccoHistory.tobaccoHistoryData![key];
			updateAppData("lifestyle", state);
		},

		resetLifestyleData: (state, action: PayloadAction<"RESET" | "REMOVE">) => {
			state.lifestyleData = initialState.lifestyleData;
			state.alcoholHistory = initialState.alcoholHistory;
			state.tobaccoHistory = initialState.tobaccoHistory;

			if (action.payload === "RESET") {
				updateAppData("lifestyle", state);
			} else if (action.payload === "REMOVE") {
				updateAppData("lifestyle", null);
			}
		},
	},
});

export const {
	setLifestyleData,
	resetLifestyleData,
	setFullLifestyleData,
	setHasHistory,
	setAlcoholHistory,
	setTobaccoHistory,
	resetAlcoholHistory,
	resetTobaccoHistory
} = lifestyleSlice.actions;

// Safe reducer export that handles undefined state
export default function lifestyleReducer(
	state: LifestyleState | undefined,
	action: Parameters<typeof lifestyleSlice.reducer>[1]
): LifestyleState {
	return lifestyleSlice.reducer(state ?? initialState, action);
}