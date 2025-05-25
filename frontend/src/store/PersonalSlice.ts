import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {	PersonalData,	PersonalState, ProfileType } from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";

// Load from localStorage if available
const storedAppData = getStoredAppData();
const initialState: PersonalState = {
	personalInfo: storedAppData.personal?.personalInfo ?? {},
};

const personalSlice = createSlice({
	name: "personal",
	initialState,
	reducers: {
		setPersonalData(
			state,
			action: PayloadAction<{
				profileType: ProfileType;
				data: PersonalData;
				index?: number;
			}>
		) {
			const { profileType, data, index } = action.payload;

			if (profileType === "son" || profileType === "daughter") {
				if (!Array.isArray(state.personalInfo[profileType])) {
					state.personalInfo[profileType] = [];
				}
				const arr = state.personalInfo[profileType] as PersonalData[];
				arr[index ?? 0] = data;
			} else {
				state.personalInfo[profileType] = data;
			}

			updateAppData("personal", state);
		},
		syncPersonalDataWithSelection(
			state,
			action: PayloadAction<
				Record<ProfileType, { selected: boolean; count: number }>
			>
		) {
			const selection = action.payload;

			for (const profileType in state.personalInfo) {
				const selected = selection[profileType as ProfileType]?.selected;
				const count = selection[profileType as ProfileType]?.count ?? 0;

				if (!selected) {
					delete state.personalInfo[profileType as ProfileType];
				} else if (
					(profileType === "son" || profileType === "daughter") &&
					Array.isArray(state.personalInfo[profileType as ProfileType])
				) {
					const arr = state.personalInfo[
						profileType as ProfileType
					] as PersonalData[];

					// Adjust array length to count
					if (arr.length > count) {
						arr.length = count;
					} else {
						while (arr.length < count) {
							arr.push({} as PersonalData);
						}
					}
				}
			}

			updateAppData("personal", state);
		},
		resetPersonalData(state) {
			state.personalInfo = {};
			updateAppData("personal", state);
		},
	},
});

export const {
	setPersonalData,
	syncPersonalDataWithSelection,
	resetPersonalData,
} = personalSlice.actions;

// Safe reducer export that handles undefined state
export default function personalReducer(
	state: PersonalState | undefined,
	action: Parameters<typeof personalSlice.reducer>[1]
): PersonalState {
	return personalSlice.reducer(state ?? initialState, action);
}