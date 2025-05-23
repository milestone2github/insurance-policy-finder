import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { defaultProfilesMap } from "../../utils/constants";
import type { ProfileData, ProfileSelectionState, ProfileType } from "../../utils/interfaces";

const initialState: ProfileSelectionState = {
	profiles: defaultProfilesMap.reduce((acc, { profileType, label, countable }) => {
			acc[profileType] = {
				label,
				selected: false,
				count: 0,
				countable,
			};
			return acc;
		}, {} as Record<ProfileType, ProfileData>
	),
};

const profileSelectionSlice = createSlice({
	name: "profileSelection",
	initialState,
	reducers: {
		toggleProfile(state, action: PayloadAction<ProfileType>) {
			const profile = state.profiles[action.payload];
			if (!profile.countable) {
				profile.selected = !profile.selected;
				profile.count = profile.selected ? 1 : 0;
			}
		},
		incrementProfile(state, action: PayloadAction<ProfileType>) {
			const profile = state.profiles[action.payload];
			if (profile.countable) {
				profile.selected = true;
				profile.count += 1;
			}
		},
		decrementProfile(state, action: PayloadAction<ProfileType>) {
			const profile = state.profiles[action.payload];
			if (profile.countable && profile.count > 0) {
				profile.count -= 1;
				if (profile.count === 0) {
					profile.selected = false;
				}
			}
		},
		saveProfiles(state, action: PayloadAction<ProfileSelectionState>) {
			state.profiles = action.payload.profiles;
		},

		// resetProfiles(state) {
		// 	for (const key in state.profiles) {
		// 		const profile = state.profiles[key];
		// 		profile.selected = false;
		// 		profile.count = 0;
		// 	}
		// },
		// saveProfiles(state, action: PayloadAction<typeof state.profiles>) {
	},
});

export const {
	toggleProfile,
	incrementProfile,
	decrementProfile,
	// resetProfiles,
	saveProfiles
} = profileSelectionSlice.actions;

export default profileSelectionSlice.reducer;
