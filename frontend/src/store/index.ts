// Redux Store (Global App setup)import { configureStore } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import personalReducer from "./PersonalSlice";
import profileReducer from "./profile/ProfileSlice";
// import lifestyleReducer from "./lifestyle/LifestyleSlice";
// import medicalConditionReducer from "./medicalCondition/MedicalConditionSlice";
// import existingPolicyReducer from "./existingPolicy/ExistingPolicySlice";

export const store = configureStore({
	reducer: {
		profileSelection: profileReducer,
		personal: personalReducer,
		// lifestyle: lifestyleReducer,
		// medicalCondition: medicalConditionReducer,
		// existingPolicy: existingPolicyReducer,
	},
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
