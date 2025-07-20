// Common Fetch function to fetch Profile label, name, decoding age from dob for use in Components

/*********** WORKING : COMMON FETCH DATA FUNCTION TO REMOVE REDUNDANCY *************/

import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetAllState } from "../store/resetSlice";
import { resetLifestyleData } from "../store/LifestyleSlice";

export const fetchProfilesData = (currentStep) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const profiles = useSelector((s) => s.profiles.profileData);
  // const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
  const lifestyle = useSelector((s) => s.lifestyle.lifestyleData);
  // const medicalHistory = useSelector((s: RootState) => s.medicalHistory.historyData);
  // const existingPolicy = useSelector((s: RootState) => s.existingPolicy.policyCount);
  // const review = useSelector((s: RootState) => s.review);

  // Check & Initialize for empty state values in parent components and/or in profile selection
  useEffect(() => {
		const isSubPage = location.pathname !== `/${currentStep}`;
		if (isSubPage) {
			switch (currentStep) {
				case "lifestyle":
					if (Object.keys(lifestyle).length === 0) {
						dispatch(resetLifestyleData("RESET"));
						navigate("/lifestyle");
					}
					break;

				// case "medicalHistory":
				// 	if (Object.keys(medicalHistory).length === 0) {
				// 		dispatch(resetMedicalHistoryData());
				// 		navigate("/medicalHistory");
				// 	}
				// 	break;

				// case "existingPolicy":
				// 	// if (Object.keys(existingPolicy).length === 0) {
				// 	if (
				// 		existingPolicy.policyCount === undefined ||
				// 		existingPolicy.policyCount === null
				// 	) {
				// 		dispatch(resetExistingPolicyData());
				// 		navigate("/existing-policy");
				// 	}
				// 	break;
			}
		} else {
      if (Object.keys(profiles).length === 0) {
				dispatch(resetAllState()); // Clear all the state and localstorage in case all profiles are found unselected
				navigate("/");
				return;
			}
		}
	}, [
		profiles,
		lifestyle,
		// medicalHistory,
		// existingPolicy,
		// review,
		navigate,
		currentStep,
		location.pathname,
	]);

  
}