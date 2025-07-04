import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
	PersonalData,
	PersonalState,
	ProfileType,
} from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";
import { genderOptions } from "../utils/constants";

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
				profileKey: ProfileType | string;
				data: PersonalData;
			}>
		) {
			const { profileKey, data } = action.payload;
			state.personalInfo[profileKey] = data;
			updateAppData("personal", state);
		},

		syncPersonalDataWithSelection(
      state,
      action: PayloadAction<
        Record<ProfileType, { selected: boolean; count: number }>
      >
    ) {
      const selection = action.payload;
      const newPersonalInfo: Record<string, PersonalData> = {};

			const createDefaultPersonalData = (key: string): PersonalData => {
				let defaultGender = "";

				// Use genderOptions for default if available and has options
				if (genderOptions[key as keyof typeof genderOptions]?.length > 0) {
					defaultGender = genderOptions[key as keyof typeof genderOptions][0];
				// } else if (key.startsWith("son") || key === "father") {
				// } else if (key.startsWith("son") || ["father", "fatherInLaw", "grandfather"].includes(key)) {
				} else if (["son", "father", "fatherInLaw", "grandfather"].some(prefix => key.startsWith(prefix))) {
					defaultGender = "male";
				// } else if (key.startsWith("daughter") || key === "mother") {
				// } else if (key.startsWith("daughter") || ["mother", "motherInLaw", "grandmother"].includes(key)) {
				} else if (["daughter", "mother", "motherInLaw", "grandmother"].some(prefix => key.startsWith(prefix))) {
					defaultGender = "female";
				}

				return {
					name: "",
					dob: "",
					gender: defaultGender,
					pincode: "", // Initialize pincode as empty string
				};
			};

      Object.entries(selection).forEach(([type, { selected, count }]) => {
        if (!selected) return;

        // if (type === "son" || type === "daughter") {
        if (["son", "daughter", "grandfather", "grandmother"].includes(type)) {
          for (let i = 1; i <= count; i++) {
            const key = `${type}-${i}`;
            // If data exists, merge it, otherwise use default
            newPersonalInfo[key] = {
              ...createDefaultPersonalData(key), // Start with defaults
              ...(state.personalInfo[key] || {}), // Overlay any existing data
            };
          }
        } else {
          newPersonalInfo[type] = {
            ...createDefaultPersonalData(type), // Start with defaults
            ...(state.personalInfo[type] || {}), // Overlay any existing data
          };
        }
      });

      state.personalInfo = newPersonalInfo;
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

export default function personalReducer(
	state: PersonalState | undefined,
	action: Parameters<typeof personalSlice.reducer>[1]
): PersonalState {
	return personalSlice.reducer(state ?? initialState, action);
}
