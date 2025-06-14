import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/mNiveshLogo.png";

const steps = [
	{ label: "Personal", path: "/" },
	{ label: "Lifestyle", path: "/lifestyle" },
	{ label: "Medical/health Conditions", path: "/medical-history" },
	{ label: "Existing policy", path: "/policies" },
	{ label: "Review", path: "/review" },
];

const Sidebar = () => {
	const location = useLocation();
	const [open, setOpen] = useState(false);

	const currentStepIndex = steps.findIndex((step) => {
		if (step.path === "/") {
			return (
				location.pathname === "/" || location.pathname.startsWith("/personal")
			);
		}
		if (step.path === "/medical-history") {
			return location.pathname.startsWith("/medical");
		}
		return location.pathname.startsWith(step.path);
	});

	return (
		<>
			{/* Toggle Button (Mobile Only) */}
			<button
				className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded shadow"
				onClick={() => setOpen(!open)}
			>
				{open ? <FiX size={20} /> : <FiMenu size={20} />}
			</button>

			<aside
				className={`bg-[#2D3748] text-white py-8 px-6 fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-200 ease-in-out
	${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="mb-12 pl-2">
						<img src={logo} alt="mNivesh Logo" className="h-8" />
					</div>

					{/* Stepper */}
					<ol className="space-y-6">
						{steps.map((step, i) => {
							const isCompleted = i < currentStepIndex;
							const isCurrent =
								i === currentStepIndex ||
								(step.path === "/" && location.pathname === "/");

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
										className="flex items-center space-x-4 group"
										onClick={() => setOpen(false)}
									>
										<div
											className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-medium group-hover:text-gray-50 ${dotStyle}`}
										>
											{i + 1}
										</div>
										<span
											className={`text-sm font-medium whitespace-nowrap max-w-[12rem] group-hover:text-gray-50 ${textStyle}`}
										>
											{step.label}
										</span>
									</NavLink>
								</li>
							);
						})}
					</ol>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
