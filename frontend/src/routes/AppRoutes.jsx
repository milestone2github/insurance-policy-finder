import { Routes, Route } from "react-router-dom";
import RMLogin from "../pages/admin/RMLogin";
// Profile imports
import Profile from "../pages/personal/Profile";
import Personal from "../pages/personal/Personal";
// Lifestyle imports
import FitnessCheck from "../pages/lifestyle/LifestyleInput";
import AlcoholHistory from "../pages/lifestyle/AlcoholHistory/AlcoholHistory";
import Frequency from "../pages/lifestyle/AlcoholHistory/Frequency";
import TobaccoHistory from "../pages/lifestyle/TobaccoHistory/TobaccoHistory";
import Usage from "../pages/lifestyle/TobaccoHistory/Usage";
// MedicalHistory imports
import MedicalHistory from "../pages/medicalCondition/MedicalHistory";
import MedicalTestHistory from "../pages/medicalCondition/MedicalTestHistory";
import Hospitalisation from "../pages/medicalCondition/Hospitalisation";
import MedicalCommon from "../pages/medicalCondition/MedicalCommon";
// Existing Policies imports
import ExistingPolicies from "../pages/existingPolicy/ExistingPolicies";
import PolicyDetails from "../pages/existingPolicy/PolicyDetails";
// Review page import
import ReviewPage from "../pages/ReviewPage";

function AppRoutes() {
	return (
		<>
			<Routes>
				<Route path="/admin/rm" element={<RMLogin />} />
				<Route path="/" element={<Profile />} />
				<Route path="/personal/input-names" element={<Personal />} />

				<Route path="/lifestyle" element={<FitnessCheck />} />
				<Route path="/lifestyle/habit-history-1" element={<AlcoholHistory />} />
				<Route path="/lifestyle/habit-history-1/frequency" element={<Frequency />} />
				<Route path="/lifestyle/habit-history-2" element={<TobaccoHistory />} />
				<Route path="/lifestyle/habit-history-2/usage" element={<Usage />} />

				<Route path="/medical-history" element={<MedicalHistory />} />
				<Route path="/medical/test-history" element={<MedicalTestHistory />} />
				<Route path="/medical/hospitalisation" element={<Hospitalisation />} />
				<Route path="/medical/data" element={<MedicalCommon />} />

				<Route path="/policies" element={<ExistingPolicies />} />
				<Route path="/policies/info" element={<PolicyDetails />} />

				<Route path="/review" element={<ReviewPage />} />
			</Routes>
		</>
	);
}

export default AppRoutes;
