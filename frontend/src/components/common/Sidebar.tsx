import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/mNiveshLogo.png";
import { steps } from "../../utils/constants";

const Sidebar = () => {
	const location = useLocation();

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
			{/* Sidebar for Desktop */}
			<aside className="hidden md:flex bg-[#2D3748] text-white py-8 px-6 h-full w-64 flex-col">
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
