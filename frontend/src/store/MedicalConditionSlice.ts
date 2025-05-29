import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { MedicalConditionState } from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";

const storedAppData = getStoredAppData();
const initialState: MedicalConditionState = storedAppData.medicalCondition || {
	activeQuestion: null,
	selectedProfiles: [],
	medicalData: {},
};

const medicalConditionSlice = createSlice({
	name: "medicalCondition",
	initialState,
	reducers: {
		setActiveQuestion: (
			state,
			action: PayloadAction<
				"medicalHistory" | "medicalTest" | "hospitalisation" | null
			>
		) => {
			state.activeQuestion = action.payload;
			updateAppData("medicalCondition", state);
		},

		toggleProfileSelection: (
			state,
			action: PayloadAction<{ profileKey: string }>
		) => {
			const { profileKey } = action.payload;
			if (state.selectedProfiles.includes(profileKey)) {
				state.selectedProfiles = state.selectedProfiles.filter(
					(key) => key !== profileKey
				);
			} else {
				state.selectedProfiles.push(profileKey);
			}
			updateAppData("medicalCondition", state);
		},

		setMedicalData: (
			state,
			action: PayloadAction<{ profileKey: string; data: string[] }>
		) => {
			if (!state.medicalData) state.medicalData = {};
			const { profileKey, data } = action.payload;
			state.medicalData[profileKey] = data;
			updateAppData("medicalCondition", state);
		},

		resetMedicalConditionState: (state) => {
			state.activeQuestion = null;
			state.selectedProfiles = [];
			state.medicalData = {};
			updateAppData("medicalCondition", state);
		},

		clearProfileSelections: (state) => {
			state.selectedProfiles = [];
			updateAppData("medicalCondition", state);
		},
	},
});

export const {
	setActiveQuestion,
	toggleProfileSelection,
	setMedicalData,
	clearProfileSelections,
	resetMedicalConditionState,
} = medicalConditionSlice.actions;

export default function medicalConditionReducer(
	state: MedicalConditionState | undefined,
	action: Parameters<typeof medicalConditionSlice.reducer>[1]
): MedicalConditionState {
	return medicalConditionSlice.reducer(state ?? initialState, action);
}
