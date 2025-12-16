import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/common/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/common/Header";
import { ProgressContext } from "./utils/ProgressContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { stepGroups } from "./utils/constants";
import { useSearchParams } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

export default function App() {
	const [searchParams] = useSearchParams();
	const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
	const location = useLocation();

	// -------------------------------------------
	// Calculate Progress and Send to Header, Global Context
	// -------------------------------------------
	const allPaths = stepGroups.flatMap((g) => g.paths);

	const progressPercent = (() => {
		let currentIndex = -1;

		for (let i = 0; i < allPaths.length; i++) {
			const p = allPaths[i];
			if (
				location.pathname === p ||
				(location.pathname !== "/" && location.pathname.startsWith(p))
			) {
				currentIndex = i;
			}
		}

		return currentIndex >= 0 ? ((currentIndex + 1) / allPaths.length) * 100 : 0;
	})();

	// console.log("Progress Percent:-- ", progressPercent);  // debug

	// -------------------------------------------
	// Check admin status only when landing on "/"
	// -------------------------------------------
	useEffect(() => {
		async function verifyAdmin() {
			try {
				// Only check on homepage (OAuth redirect + refresh)
				if (location.pathname !== "/") return;

				const res = await axios.get(`${baseUrl}/auth/zoho/getAccessToken`, {
					withCredentials: true,
				});

				// Save RM data
				localStorage.setItem("isRM", res.data.isRM ? "true" : "false");
				localStorage.setItem("rmId", res.data.rmId ?? "");

				if (res.data.isValid && res.data.isRM) {
					setIsAdminLoggedIn(true);
					return; // RM VERIFIED
				}

				// RM invalid → clear RM state
				localStorage.setItem("isRM", "false");
				localStorage.removeItem("rmId");
				setIsAdminLoggedIn(false);
			} catch (err) {
				localStorage.setItem("isRM", "false");
				localStorage.removeItem("rmId");
				setIsAdminLoggedIn(false);
			}
			// VerifyAdmin failed → Check for JWT in URL
			handleURLToken();
		}

		verifyAdmin();
	}, [location.pathname]);

	// -------------------------------------------
	// Fallback: Use Search Params to check for valid JWT
	// -------------------------------------------
	function handleURLToken() {
		const token = searchParams.get("token");
		if (!token) return;

		localStorage.setItem("authToken", token);
		localStorage.setItem("entryType", "ads");

		// remove from URL
		window.history.replaceState({}, "", window.location.pathname);
	}

	return (
		<ProgressContext.Provider value={progressPercent}>
			<div className="flex h-screen overflow-auto">
				<Sidebar isAdminLoggedIn={isAdminLoggedIn} />
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
