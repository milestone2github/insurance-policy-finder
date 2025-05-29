// Redux Store (Global App setup)import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import profileReducer from "./ProfileSlice";
import personalReducer from "./PersonalSlice";
import lifestyleReducer from "./LifestyleSlice";
import { getStoredAppData } from "../utils/persistence";
import { resetAllState } from "./resetSlice";
import medicalConditionReducer from "./MedicalConditionSlice";
import existingPolicyReducer from "./ExistingPolicySlice";

const combinedReducer = combineReducers({
	profiles: profileReducer,
	personal: personalReducer,
	lifestyle: lifestyleReducer,
	medicalCondition: medicalConditionReducer,
	existingPolicy: existingPolicyReducer,
});

const rootReducer = (state: any, action: any) => {
	if (action.type === resetAllState.type) {
		// Clear localStorage
		localStorage.removeItem("insuranceFormData");
		// Reset all slices to initial state
		return combinedReducer(undefined, { type: "" });
	}
	return combinedReducer(state, action);
};

const preloadedState = getStoredAppData();

export const store = configureStore({
	reducer: rootReducer,
	preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;






/** Legacy store **/
// const preloadedState = getStoredAppData();
// export const store = configureStore({
// 	reducer: {
// 		profiles: profileReducer,
// 		personal: personalReducer,
// 		lifestyle: lifestyleReducer,
// 	},
// 	preloadedState
// });

// // Types for use in components
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

/*****/
