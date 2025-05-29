import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import ReviewPage from "../pages/ReviewPage";
import Profile from "../pages/personal/Profile";
import Personal from "../pages/personal/Personal";
import FitnessCheck from "../pages/lifestyle/LifestyleInput";
import AlcoholHistory from "../pages/lifestyle/AlcoholHistory/AlcoholHistory";
import Frequency from "../pages/lifestyle/AlcoholHistory/Frequency";
import TobaccoHistory from "../pages/lifestyle/TobaccoHistory/TobaccoHistory";
import Usage from "../pages/lifestyle/TobaccoHistory/Usage";
import MedicalHistory from "../pages/medicalCondition/MedicalHistory";
import MedicalTestResult from "../pages/medicalCondition/MedicalTestResult";
import Hospitalization from "../pages/medicalCondition/Hospitalization";
import ExistingPolicies from "../pages/existingPolicy/ExistingPolicies";
import PolicyDetails from "../pages/existingPolicy/PolicyDetails";
import MedicalCommon from "../pages/medicalCondition/MedicalCommon";

function AppRoutes() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Profile />} />
				<Route path="/personal/input-names" element={<Personal />} />

				<Route path="/lifestyle" element={<FitnessCheck />} />
				<Route path="/lifestyle/habit-history-1" element={<AlcoholHistory />} />
				<Route path="/lifestyle/habit-history-1/frequency" element={<Frequency />} />
				<Route path="/lifestyle/habit-history-2" element={<TobaccoHistory />} />
				<Route path="/lifestyle/habit-history-2/usage" element={<Usage />} />

				<Route path="/medical-history" element={<MedicalHistory />} />
				<Route path="/medical/test-results" element={<MedicalTestResult />} />
				<Route path="/health/hospitalisation-check" element={<Hospitalization />} />
				<Route path="/medical/data" element={<MedicalCommon />} />

				<Route path="/policies" element={<ExistingPolicies />} />
				<Route path="/policies/info" element={<PolicyDetails />} />

				{/* <Route path="/review" element={<ReviewPage />} /> */}
			</Routes>
		</>
	);
}

export default AppRoutes;
