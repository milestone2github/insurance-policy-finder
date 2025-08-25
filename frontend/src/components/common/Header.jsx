import { NavLink, useLocation } from "react-router-dom";
import { steps } from "../../utils/constants";
import { useProgressValue } from "../../utils/progressContext";

// Grouped substeps under main sections
const stepGroups = [
	{
		main: "Personal",
		paths: ["/", "/personal/input-names"],
	},
	{
		main: "Lifestyle",
		paths: [
			"/lifestyle",
			"/lifestyle/habit-history-1",
			"/lifestyle/habit-history-1/frequency",
			"/lifestyle/habit-history-2",
			"/lifestyle/habit-history-2/usage",
		],
	},
	{
		main: "Medical",
		paths: [
			"/medical-history",
			"/medical/test-history",
			"/medical/hospitalisation",
			"/medical/data",
		],
	},
	{
		main: "Policies",
		paths: ["/policies", "/policies/info"],
	},
	{
		main: "Review",
		paths: ["/review"],
	},
];

export default function Header() {
	const location = useLocation();

	
	// Flatten all substep paths for total progress
	const allPaths = stepGroups.flatMap((g) => g.paths);

	// Find current step index by matching the first path group that matches current location
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

	const progressPercent = useProgressValue();
	// const progressPercent =
	// 	currentIndex >= 0 ? ((currentIndex + 1) / allPaths.length) * 100 : 0;

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
			<div className="w-full">
				{/* Top Blue bar above dynamic pages on large screens */}
				<div className="h-6 bg-[#2D3748] hidden md:block" />

				{/* Top Stepper for Mobile */}
				<div className="relative md:hidden bg-[#2D3748] px-4 py-3 shadow">
					{/* Background line (between first and last dots) */}
					<div className="absolute left-[12.5%] right-[12.5%] top-1/2 h-0.5 bg-gray-600 z-0 transform -translate-y-1/2" />

					{/* Progress line (to center of current step) */}
					<div
						className="absolute left-[12.5%] top-1/2 h-0.5 bg-white z-10 transform -translate-y-1/2 transition-all duration-300"
						style={{
							width: `${Math.min(
								(currentStepIndex / (steps.length - 1)) * 75,
								75
							)}%`,
						}}
					/>

					{/* Step circles */}
					<div className="flex items-center justify-between relative z-20">
						{steps.map((step, i) => {
							const isCompleted = i < currentStepIndex;
							const isCurrent =
								i === currentStepIndex ||
								(step.path === "/" && location.pathname === "/");

							const circleStyle = isCurrent
								? "bg-[#162133] text-white"
								: isCompleted
								? "bg-[#162133] text-white"
								: "bg-[#1e2a38] text-gray-400";

							return (
								<div
									key={i}
									className="flex flex-col items-center text-xs w-full"
								>
									<NavLink
										to={step.path}
										className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto ${circleStyle}`}
									>
										{i + 1}
									</NavLink>
								</div>
							);
						})}
					</div>
				</div>

				<div
					className="h-1 bg-orange-500 transition-all duration-300"
					style={{ width: `${progressPercent}%` }}
				/>
			</div>
	);
}
