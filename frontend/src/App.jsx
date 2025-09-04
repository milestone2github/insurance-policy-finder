import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/common/Header";
import { ProgressContext } from "./utils/progressContext";
import { useLocation, useSearchParams } from "react-router-dom";

export default function App() {
	const [searchParams] = useSearchParams();
	// const contactNumber = searchParams.get("phone");	// Query Parameter
	// if (contactNumber) {
		// 	localStorage.setItem("contactNumber", contactNumber);
		// }
	const token = searchParams.get("token");	// Query Parameter
	if (token) {
		localStorage.setItem("authToken", token);
		window.history.replaceState({}, "", window.location.pathname);	// clean url
	}

	const location = useLocation();

	// Progress Calculation Logic
	const stepGroups = [
		{ paths: ["/", "/personal/input-names"] },
		{
			paths: [
				"/lifestyle",
				"/lifestyle/habit-history-1",
				"/lifestyle/habit-history-1/frequency",
				"/lifestyle/habit-history-2",
				"/lifestyle/habit-history-2/usage",
			],
		},
		{
			paths: [
				"/medical-history",
				"/medical/test-history",
				"/medical/hospitalisation",
				"/medical/data",
			],
		},
		{ paths: ["/policies", "/policies/info"] },
		{ paths: ["/review"] },
	];

	const allPaths = stepGroups.flatMap((g) => g.paths);
	let currentIndex = -1;
	for (let i = 0; i < allPaths.length; i++) {
		const path = allPaths[i];
		if (
			location.pathname === path ||
			(location.pathname !== "/" && location.pathname.startsWith(path))
		) {
			currentIndex = i;
		}
	}

	const progressPercent =
		currentIndex >= 0 ? ((currentIndex + 1) / allPaths.length) * 100 : 0;

	// -----------------------------------------------

	return (
		<ProgressContext.Provider value={progressPercent}>
			<div className="flex h-screen overflow-auto">
				<Sidebar />
				<div className="flex flex-col grow bg-white">
					<Header />
					<div className="flex-1 justify-center overflow-y-auto bg-gray-50">
						<Toaster position="bottom-center" />
						<AppRoutes />
					</div>
				</div>
			</div>
		</ProgressContext.Provider>
	);
}
