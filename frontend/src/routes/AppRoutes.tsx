import { Routes, Route } from "react-router-dom";
// import Home from "../pages/Home";
// import ReviewPage from "../pages/ReviewPage";
import Personal from "../pages/personal/Personal";
import NamesInput from "../pages/personal/NamesInput";
import FitnessCheck from "../pages/lifestyle/LifestyleInput";
import Habits1 from "../pages/lifestyle/Habits1";
import Habits2 from "../pages/lifestyle/Habits2";

function AppRoutes() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Personal />} />
				<Route path="/personal/input-names" element={<NamesInput />} />

				<Route path="/lifestyle" element={<FitnessCheck />} />
				<Route path="/lifestyle/habit-history-1" element={<Habits1 />} />
				<Route path="/lifestyle/habit-history-2" element={<Habits2 />} />

				{/* <Route path="/health/history" element={<MedicalHistory />} /> */}
				{/* <Route path="/health/test-results" element={<MedicalTestResult />} /> */}
				{/* <Route
					path="/health/hospitalization-check"
					element={<Hospitalization />}
				/> */}

				{/* <Route path="/policy" element={<ExistingPolicies />} /> */}
				{/* <Route path="/policy/info" element={<PolicyDetails />} /> */}

				{/* <Route path="/review" element={<ReviewPage />} /> */}
			</Routes>
		</>
	);
}

export default AppRoutes;
