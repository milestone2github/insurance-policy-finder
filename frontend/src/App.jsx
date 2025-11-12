import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/common/Header";
import { ProgressContext } from "./utils/ProgressContext";
import { useLocation, useSearchParams } from "react-router-dom";
import { stepGroups } from "./utils/constants";
import { useEffect } from "react";

export default function App() {
	const [searchParams] = useSearchParams();	// Token will come embedded in params
	useEffect(() => {
		const token = searchParams.get("token");
		if (token) {
			localStorage.setItem("authToken", token);
			window.history.replaceState({}, "", window.location.pathname);
		}
	}, [searchParams]);

	const location = useLocation();

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

	const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / allPaths.length) * 100 : 0;

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
