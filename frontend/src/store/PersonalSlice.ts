// store/personalSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PersonalData, PersonalState, ProfileType } from "../utils/interfaces";

const initialState: PersonalState = {
	personalDetails: {},		// Storage of Names, DOB, Gender, Pincode of each individual
};

const personalSlice = createSlice({
	name: "personal",
	initialState,
	reducers: {
		setPersonalData(state, action: PayloadAction<{ profileType: ProfileType; data: PersonalData }>) {
			const { profileType, data } = action.payload;
			state.personalDetails[profileType] = data;
		}
	},
});

export const { setPersonalData } = personalSlice.actions;
export default personalSlice.reducer;
