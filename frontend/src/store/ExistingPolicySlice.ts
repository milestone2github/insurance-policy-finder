import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ExistingPolicyState
} from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";

// Load initial state from insuranceFormData
const storedAppData = getStoredAppData();
const initialState: ExistingPolicyState = storedAppData.existingPolicy || {
  hasExistingPolicy: false,
	existingPolicyData: {},
};

const existingPolicySlice = createSlice({
	name: "existingPolicy",
	initialState,
	reducers: {
		setExistingPolicyData(state, action: PayloadAction) {},

		resetExistingPolicyData(state) {

    }
	},
});

export const {
	setExistingPolicyData,
	resetExistingPolicyData,
} = existingPolicySlice.actions;

// Safe reducer export that handles undefined state
export default function existingPolicyReducer(
	state: ExistingPolicyState | undefined,
	action: Parameters<typeof existingPolicySlice.reducer>[1]
): ExistingPolicyState {
	return existingPolicySlice.reducer(state ?? initialState, action);
}
