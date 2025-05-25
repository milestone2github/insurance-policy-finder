// Redux Store (Global App setup)import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./ProfileSlice";
import personalReducer from "./PersonalSlice";
import lifestyleReducer from "./LifestyleSlice";
import { getStoredAppData } from "../utils/persistence";
// import medicalConditionReducer from "./medicalCondition/MedicalConditionSlice";
// import existingPolicyReducer from "./existingPolicy/ExistingPolicySlice";

const preloadedState = getStoredAppData();
export const store = configureStore({
	reducer: {
		profiles: profileReducer,
		personal: personalReducer,
		lifestyle: lifestyleReducer,
		// medicalCondition: medicalConditionReducer,
		// existingPolicy: existingPolicyReducer,
	},
	preloadedState
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
