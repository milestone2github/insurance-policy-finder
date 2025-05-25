import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LifestyleData, LifestyleOption, LifestyleState } from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";



// Load initial state from insuranceFormData
const storedAppData = getStoredAppData();
const initialState: LifestyleState = storedAppData.lifestyle || {
	lifestyleData: {},
};

const lifestyleSlice = createSlice({
	name: "lifestyle",
	initialState,
	reducers: {
		setLifestyleData: (state, action: PayloadAction<LifestyleData>) => {
			const { profileType, index, fitness } = action.payload;
			const isChild = profileType === "son" || profileType === "daughter";

			if (isChild) {
				const arr = (state.lifestyleData[profileType] ??
					[]) as LifestyleOption[];
				arr[index] = fitness;
				state.lifestyleData[profileType] = arr;
			} else {
				state.lifestyleData[profileType] = fitness;
			}

			updateAppData("lifestyle", state);
		},

		resetLifestyleData: (state) => {
			state.lifestyleData = {};
			updateAppData("lifestyle", state);
		},

		setFullLifestyleData: (
			state,
			action: PayloadAction<{
				[key: string]: LifestyleOption | LifestyleOption[];
			}>
		) => {
			state.lifestyleData = action.payload;
			updateAppData("lifestyle", state);
		},
	},
});

export const {
	setLifestyleData,
	resetLifestyleData,
	setFullLifestyleData
} = lifestyleSlice.actions;

// Safe reducer export that handles undefined state
export default function lifestyleReducer(
	state: LifestyleState | undefined,
	action: Parameters<typeof lifestyleSlice.reducer>[1]
): LifestyleState {
	return lifestyleSlice.reducer(state ?? initialState, action);
}