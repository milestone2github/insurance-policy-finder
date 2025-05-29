import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  MedicalConditionState
} from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";

// Load initial state from insuranceFormData
const storedAppData = getStoredAppData();
const initialState: MedicalConditionState = storedAppData.medicalCondition || {
  medicalHistory: {
    hasMedicalHistory: false
  },
  // medicalTest: {
  //   hasMedicalTest: false
  // },
  // hospitalisation: {
  //   hasHospitalisation: false
  // },
};

const medicalConditionSlice = createSlice({
	name: "medicalCondition",
	initialState,
	reducers: {
		setMedicalHistoryData(state, action: PayloadAction) {},

		resetMedicalHistoryData(state) {},
	},
});

export const {
  setMedicalHistoryData,
  resetMedicalHistoryData,
} = medicalConditionSlice.actions;

// Safe reducer export that handles undefined state
export default function medicalConditionReducer(
  state: MedicalConditionState | undefined,
  action: Parameters<typeof medicalConditionSlice.reducer>[1]
): MedicalConditionState {
  return medicalConditionSlice.reducer(state ?? initialState, action);
}
