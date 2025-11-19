import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LeadCaptureModal from "../shared/LeadCaptureModal";
import logo from "../../assets/mNiveshLogo.png";
import { steps } from "../../utils/constants";
import { useProgressValue } from "../../utils/ProgressContext";
import toast from "react-hot-toast";
import axios from "axios";

const Sidebar = ({isAdminLoggedIn}) => {
	const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
	const progressPercent = useProgressValue();
	const location = useLocation();
	const navigate = useNavigate();
	const [showLeadModal, setShowLeadModal] = useState(false);
	const [maxProgressAllowed, setMaxProgressAllowed] = useState(progressPercent);
	const [showAdmin, setShowAdmin] = useState(false);

	// Set Admin status if logged in and valid
	useEffect(() => {
		if (isAdminLoggedIn) {
			setShowAdmin(true);
		} else {
			setShowAdmin(false);
		}
	}, [isAdminLoggedIn]);

	const selfName = useSelector(
		(s) => s.personal.personalInfo?.myself?.name || "User"
	);

	// Find the base route for redirection
	const currentStepIndex = steps.findIndex((step) => {
		if (step.path === "/")
			return (
				location.pathname === "/" || location.pathname.startsWith("/personal")
			);
		if (step.path === "/medical-history")
			return location.pathname.startsWith("/medical");
		return location.pathname.startsWith(step.path);
	});

	// Always update maxStepVisited to the furthest step
	useEffect(() => {
		setMaxProgressAllowed((prev) => Math.max(prev, progressPercent));
	}, [progressPercent]);

	// Handle Sidebar navigation logic
	const handleStepClick = (e, path, progressMap) => {
		const authToken = localStorage.getItem("authToken");

		// console.log("Current Progress ==> ", progressMap); // debug
		// console.log("Max Progress allowed ==> ", maxProgressAllowed); // debug

		// Show lead modal if not logged in
		if (!authToken && path !== location.pathname) {
			e.preventDefault();
			setShowLeadModal(true);
			return;
		}

		// Prevent review page if < 90%
		if (path === "/review" && maxProgressAllowed < 90) {
			e.preventDefault();
			toast.error("Complete all the steps first");
			return;
		}

		// Prevent skipping ahead beyond unlocked steps
		if (progressMap > maxProgressAllowed) {
			e.preventDefault();
			toast.error("Complete current/previous steps first");
			return;
		}
		
		navigate(path);
	};

	const handleLogout = async () => {
		await axios.get(`${baseUrl}/auth/zoho/logout`, { withCredentials: true });
		localStorage.removeItem("isRM");
		localStorage.removeItem("rmId");

		window.location.href = "/";
	}

	return (
		<>
			<aside className="hidden md:flex bg-[#2D3748] text-white py-8 px-6 h-full w-64 flex-col">
				<div className="flex flex-col h-full">
					<div className="flex flex-row mb-12 pl-2">
						<img src={logo} alt="mNivesh Logo" className="h-8" />
						{showAdmin && (
							<div
								className="
							bg-gray-50 text-black
							font-semibold shadow-md 
							m-auto ml-1.5 p-1 
							border border-red-600 rounded-md 
							hover:bg-gray-200
							cursor-default
						"
							>
								Admin
							</div>
						)}
					</div>

					<ol className="space-y-6">
						{steps.map((step, i) => {
							const isCompleted = i < currentStepIndex;
							const isCurrent = i === currentStepIndex;
							const dotStyle = isCurrent
								? "bg-[#162133] text-white"
								: isCompleted
								? "bg-[#162133]"
								: "bg-[#1e2a38] text-gray-400";
							const textStyle =
								isCurrent || isCompleted ? "text-white" : "text-gray-400";

							return (
								<li key={i}>
									<NavLink
										to={step.path}
										onClick={(e) =>
											handleStepClick(e, step.path, step.progress)
										}
										className="flex items-center space-x-4 group"
									>
										<div
											className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium ${dotStyle}`}
										>
											{i + 1}
										</div>
										<span
											className={`text-sm font-medium max-w-[12rem] group-hover:text-gray-50 ${textStyle}`}
										>
											{step.label}
										</span>
									</NavLink>
								</li>
							);
						})}
					</ol>

					{showAdmin && (
						<div
							className="
							m-auto mt-6 px-4 py-2 
							font-semibold rounded-md
							bg-red-200 text-red-500 
							hover:bg-gray-200 hover:text-black
							"
						>
							<button onClick={handleLogout}>Logout</button>
						</div>
					)}
				</div>
			</aside>

			<LeadCaptureModal
				isOpen={showLeadModal}
				defaultName={selfName ? selfName : ""}
				onClose={() => setShowLeadModal(false)}
				onSubmit={() => {
					setShowLeadModal(false);
					// navigate("/review");
				}}
			/>
		</>
	);
};

export default Sidebar;
