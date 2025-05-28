import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import ReviewPage from "../pages/ReviewPage";
import Profile from "../pages/personal/Profile";
import Personal from "../pages/personal/Personal";
import FitnessCheck from "../pages/lifestyle/LifestyleInput";
import AlcoholHistory from "../pages/lifestyle/AlcoholHistory/AlcoholHistory";
import Frequency from "../pages/lifestyle/AlcoholHistory/frequency";
import TobaccoHistory from "../pages/lifestyle/TobaccoHistory/TobaccoHistory";
import Usage from "../pages/lifestyle/TobaccoHistory/usage";
// import ExistingPolicies from "../pages/existingPolicy/ExistingPolicies";
// import PolicyDetails from "../pages/existingPolicy/PolicyDetails";

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

				{/* <Route path="/health/history" element={<MedicalHistory />} /> */}
				{/* <Route path="/health/test-results" element={<MedicalTestResult />} /> */}
				{/* <Route
					path="/health/hospitalization-check"
					element={<Hospitalization />}
				/> */}

				{/* <Route path="/policy" element={<ExistingPolicies />} />
				<Route path="/policy/info" element={<PolicyDetails />} /> */}

				{/* <Route path="/review" element={<ReviewPage />} /> */}
			</Routes>
		</>
	);
}

export default AppRoutes;
