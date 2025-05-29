import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ExistingPolicyState,
  PolicyData
} from "../utils/interfaces";
import { getStoredAppData, updateAppData } from "../utils/persistence";

// Load initial state from insuranceFormData
const storedAppData = getStoredAppData();
const initialState: ExistingPolicyState = storedAppData.existingPolicy || {
  hasExistingPolicy: false,
  policyCount: 0,
	existingPolicyData: {},
};

const existingPolicySlice = createSlice({
	name: "existingPolicy",
	initialState,
	reducers: {
    setHasExistingPolicy: (state, action) => {
      state.hasExistingPolicy = action.payload;

      updateAppData("existingPolicy", state);
    },

    setPolicyCount: (state, action) => {
      state.policyCount = action.payload;

      updateAppData("existingPolicy", state);
    },
    
		setExistingPolicyData: (state, action: PayloadAction<PolicyData>) => {
      const { policyName, coverAmount, otherName, renewalDate, policyType, coverage } = action.payload;
      
      if (!state.existingPolicyData) {
				state.existingPolicyData = {};
			}

      if (policyType === "individual") {
				state.existingPolicyData[policyName] = {
          policyName,
					coverAmount,
					otherName,
					renewalDate,
					policyType,
					coverage: coverage as string,
				};
			} else if (policyType === "floater") {
				state.existingPolicyData[policyName] = {
          policyName,
					coverAmount,
					otherName,
					renewalDate,
					policyType,
					coverage: coverage as string[],
				};
			}
    
      updateAppData("existingPolicy", state);
    },

    setAllExistingPolicyData: (
      state,
      action: PayloadAction<{ [key: string]: PolicyData }>
    ) => {
      if (!state.existingPolicyData) {
        state.existingPolicyData = {};
      }
    
      for (const [key, policy] of Object.entries(action.payload)) {
        const { policyName, coverAmount, otherName, renewalDate, policyType, coverage } = policy;
    
        if (policyType === "individual") {
          state.existingPolicyData[key] = {
            policyName,
            coverAmount,
            otherName,
            renewalDate,
            policyType,
            coverage: coverage as string,
          };
        } else if (policyType === "floater") {
          state.existingPolicyData[key] = {
            policyName,
            coverAmount,
            otherName,
            renewalDate,
            policyType,
            coverage: coverage as string[],
          };
        }
      }
    
      updateAppData("existingPolicy", state);
    },    

		resetExistingPolicyData: (state) => {
      state.hasExistingPolicy = false;
      state.policyCount = 0;
      updateAppData("existingPolicy", state);
    }
	},
});

export const {
  setHasExistingPolicy,
  setPolicyCount,
	setExistingPolicyData,
  setAllExistingPolicyData,
	resetExistingPolicyData,
} = existingPolicySlice.actions;

// Safe reducer export that handles undefined state
export default function existingPolicyReducer(
	state: ExistingPolicyState | undefined,
	action: Parameters<typeof existingPolicySlice.reducer>[1]
): ExistingPolicyState {
	return existingPolicySlice.reducer(state ?? initialState, action);
}
