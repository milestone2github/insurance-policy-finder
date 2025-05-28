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

		// syncPersonalDataWithSelection(
		// 	state,
		// 	action: PayloadAction<
		// 		Record<ProfileType, { selected: boolean; count: number }>
		// 	>
		// ) {
		// 	const selection = action.payload;
		// 	const newPersonalInfo: Record<string, PersonalData> = {};

		// 	// For each profile type in selection
		// 	Object.entries(selection).forEach(([type, { selected, count }]) => {
		// 		if (!selected) return;

		// 		if (type === "son" || type === "daughter") {
		// 			// Flatten sons/daughters into keys like son-1, son-2
		// 			for (let i = 1; i <= count; i++) {
		// 				const key = `${type}-${i}`;
		// 				// Keep existing data if present, else empty object
		// 				newPersonalInfo[key] =
		// 					state.personalInfo[key] ?? ({} as PersonalData);
		// 			}
		// 		} else {
		// 			// For other profiles, keep as is
		// 			newPersonalInfo[type] =
		// 				state.personalInfo[type] ?? ({} as PersonalData);
		// 		}
		// 	});

		// 	state.personalInfo = newPersonalInfo;
		// 	updateAppData("personal", state);
		// },

		syncPersonalDataWithSelection(
      state,
      action: PayloadAction<
        Record<ProfileType, { selected: boolean; count: number }>
      >
    ) {
      const selection = action.payload;
      const newPersonalInfo: Record<string, PersonalData> = {};

      // Helper function to create a default PersonalData object
      // const createDefaultPersonalData = (key: string): PersonalData => {
      //   let defaultGender = ""; // Default to empty string for initial selection
      //   if (key.startsWith("son")) {
      //     defaultGender = "male"; // Pre-fill male for sons
      //   } else if (key.startsWith("daughter")) {
      //     defaultGender = "female"; // Pre-fill female for daughters
      //   } else if (key === "father") {
      //     defaultGender = "male";
      //   } else if (key === "mother") {
      //     defaultGender = "female";
      //   } else if (key === "spouse") {
      //     // You might want to default spouse's gender based on 'myself' later, or leave empty
      //   }
			const createDefaultPersonalData = (key: string): PersonalData => {
				let defaultGender = "";

				// Use genderOptions for default if available and has options
				if (genderOptions[key as keyof typeof genderOptions]?.length > 0) {
					defaultGender = genderOptions[key as keyof typeof genderOptions][0];
				} else if (key.startsWith("son") || key === "father") {
					defaultGender = "male";
				} else if (key.startsWith("daughter") || key === "mother") {
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

        if (type === "son" || type === "daughter") {
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
