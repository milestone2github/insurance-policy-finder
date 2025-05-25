import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { defaultProfilesMap } from "../utils/constants";
import type {
	ProfileData,
	ProfileState,
	ProfileType,
} from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";

// Load from localStorage if available
const storedAppData = getStoredAppData();
const initialState: ProfileState = {
	profileData:
		storedAppData.profiles?.profileData ??
		defaultProfilesMap.reduce((acc, { profileType, label, countable }) => {
			acc[profileType] = {
				label,
				selected: false,
				count: 0,
				countable,
			};
			return acc;
		}, {} as Record<ProfileType, ProfileData>),
};

const profileSlice = createSlice({
	name: "profiles",
	initialState,
	reducers: {
		toggleProfile(state, action: PayloadAction<ProfileType>) {
			const profile = state.profileData[action.payload];
			if (!profile.countable) {
				profile.selected = !profile.selected;
				profile.count = profile.selected ? 1 : 0;

				updateAppData("profiles", state);
			}
		},
		incrementProfile(state, action: PayloadAction<ProfileType>) {
			const profile = state.profileData[action.payload];
			if (profile.countable) {
				profile.selected = true;
				profile.count += 1;

				updateAppData("profiles", state);
			}
		},
		decrementProfile(state, action: PayloadAction<ProfileType>) {
			const profile = state.profileData[action.payload];
			if (profile.countable && profile.count > 0) {
				profile.count -= 1;
				if (profile.count === 0) {
					profile.selected = false;
				}

				updateAppData("profiles", state);
			}
		},
		resetProfiles(state) {
			for (const key in state.profileData) {
				const profile = state.profileData[key as ProfileType];
				profile.selected = false;
				profile.count = 0;
			}

			updateAppData("profiles", state);
		},
	},
});

export const {
	toggleProfile,
	incrementProfile,
	decrementProfile,
	resetProfiles,
} = profileSlice.actions;

// Safe reducer export that handles undefined state
export default function profilesReducer(
	state: ProfileState | undefined,
	action: Parameters<typeof profileSlice.reducer>[1]
): ProfileState {
	return profileSlice.reducer(state ?? initialState, action);
}
