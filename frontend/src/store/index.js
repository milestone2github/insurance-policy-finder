import { configureStore, combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./ProfileSlice";
import personalReducer from "./PersonalSlice";
import lifestyleReducer from "./LifestyleSlice";
import medicalConditionReducer from "./MedicalConditionSlice";
import existingPolicyReducer from "./ExistingPolicySlice";
import { getStoredAppData } from "../utils/persistence";
import { resetAllState } from "./resetSlice";

const combinedReducer = combineReducers({
	profiles: profileReducer,
	personal: personalReducer,
	lifestyle: lifestyleReducer,
	medicalCondition: medicalConditionReducer,
	existingPolicy: existingPolicyReducer,
});

const rootReducer = (state, action) => {
	if (action.type === resetAllState.type) {
		localStorage.removeItem("insuranceFormData");
		return combinedReducer(undefined, { type: "" });
	}
	return combinedReducer(state, action);
};

const preloadedState = getStoredAppData();

export const store = configureStore({
	reducer: rootReducer,
	preloadedState,
});



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
