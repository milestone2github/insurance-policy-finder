import { createSlice } from "@reduxjs/toolkit";
import { getStoredAppData, updateAppData } from "../utils/persistence";

const storedAppData = getStoredAppData();
const initialState = storedAppData.medicalCondition || {
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
			action
		) => {
			state.activeQuestion = action.payload;
			updateAppData("medicalCondition", state);
		},

		toggleProfileSelection: (
			state,
			action
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
			// action: PayloadAction<{ profileKey: string; data: string[] }>
			action
		) => {
			const { profileKey, data } = action.payload;
			if (state.medicalData) {
				if (!state.medicalData[profileKey]) {
					state.medicalData[profileKey] = {
						selectedIllnesses: [],
					};
				}
				state.medicalData[profileKey] = {
					...state.medicalData[profileKey],
					...data,
				};
			}
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
	state,
	action
) {
	return medicalConditionSlice.reducer(state ?? initialState, action);
}
