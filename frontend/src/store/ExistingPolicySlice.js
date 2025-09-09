import { createSlice } from "@reduxjs/toolkit";
import { getStoredAppData, updateAppData } from "../utils/persistence";

// Load initial state from insuranceFormData
const storedAppData = getStoredAppData();
const initialState = storedAppData.existingPolicy || {
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
    
		setExistingPolicyData: (state, action) => {
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
					coverage: coverage,
				};
			} else if (policyType === "floater") {
        state.existingPolicyData[policyName] = {
          policyName,
					coverAmount,
					otherName,
					renewalDate,
					policyType,
					coverage: coverage,
				};
			}
      
      updateAppData("existingPolicy", state);
    },

    setAllExistingPolicyData: (state, action) => {
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
            coverage: coverage,
          };
        } else if (policyType === "floater") {
          state.existingPolicyData[key] = {
            policyName,
            coverAmount,
            otherName,
            renewalDate,
            policyType,
            coverage: coverage,
          };
        }
      }
    
      updateAppData("existingPolicy", state);
    },    

		resetExistingPolicyData: (state) => {
      state.hasExistingPolicy = false;
      state.policyCount = 0;
      state.existingPolicyData = {};
      updateAppData("existingPolicy", state);
    },

    cleanExistingPolicyData: ((state) => {
      state.existingPolicyData = {};
      updateAppData("existingPolicy", state);
    })
	},
});

export const {
  setHasExistingPolicy,
  setPolicyCount,
	setExistingPolicyData,
  setAllExistingPolicyData,
	resetExistingPolicyData,
  cleanExistingPolicyData
} = existingPolicySlice.actions;

// Safe reducer export that handles undefined state
export default function existingPolicyReducer(state, action) {
	return existingPolicySlice.reducer(state ?? initialState, action);
}
