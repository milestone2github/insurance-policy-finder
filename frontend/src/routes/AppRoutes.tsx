import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import PersonalRoutes from "./PersonalRoutes";
// import LifestyleRoutes from "./LifestyleRoutes";
// import MedicalConditionRoutes from "./MedicalConditionRoutes";
// import ExistingPolicyRoutes from "./ExistingPolicyRoutes";
import Personal from "../pages/personal/Personal";
import NamesInput from "../pages/personal/NamesInput";
import FitnessCheck from "../pages/lifestyle/FitnessCheck";
import ReviewPage from "../pages/ReviewPage";

function AppRoutes() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Personal />} />
				<Route path="/personal/input-names" element={<NamesInput />} />

				<Route path="/lifestyle" element={<FitnessCheck />} />
				{/* <Route path="/lifestyle/alcohol-history" element={<Habits1 />} />
				<Route path="/lifestyle/smoking-history" element={<Habits2 />} />

				<Route path="/health/history" element={<MedicalHistory />} />
				<Route path="/health/test-results" element={<MedicalTestResult />} />
				<Route
					path="/health/hospitalization-check"
					element={<Hospitalization />}
				/>

				<Route path="/policy" element={<ExistingPolicies />} />
				<Route path="/policy/info" element={<PolicyDetails />} /> */}

				<Route path="/review" element={<ReviewPage />} />
			</Routes>
		</>
	);
}

export default AppRoutes;
