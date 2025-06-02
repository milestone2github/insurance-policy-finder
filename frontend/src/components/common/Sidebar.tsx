import { NavLink, useLocation } from "react-router-dom";

const steps = [
	{ label: "Personal", path: "/" },
	{ label: "Lifestyle", path: "/lifestyle" },
	{ label: "Medical/health conditions", path: "/medical-history" },
	{ label: "Existing policy", path: "/policies" },
	{ label: "Review", path: "/review" },
];

const Sidebar = () => {
	const location = useLocation();

	// Find the current step index
	// const currentStepIndex = steps.findIndex((step) =>
	// 	step.path === "/"
	// 		? location.pathname === "/"
	// 		: location.pathname.startsWith(step.path)
	// );
	const currentStepIndex = steps.findIndex((step) => {
		if (step.path === "/medical-history") {
			return location.pathname.startsWith("/medical");
		}
		return step.path === "/"
			? location.pathname === "/"
			: location.pathname.startsWith(step.path);
	});

	return (
		<aside className="w-60 p-6 border-r bg-white h-full border border-transparent">
			<h1 className="text-xl font-bold mb-10 leading-tight">
				<span className="text-green-600">mNivesh</span>
			</h1>
			<ol className="space-y-4">
				{steps.map((step, i) => {
					const isCompleted = i < currentStepIndex;
					const isCurrent =
						i === currentStepIndex ||
						(step.path === "/" && location.pathname === "/");

					return (
						<li key={i} className="flex items-center space-x-2">
							<div
								className={`w-3 h-3 rounded-full ${
									isCompleted || isCurrent
										? "bg-green-500"
										: "border border-gray-400"
								}`}
							/>
							<NavLink
								to={step.path}
								className={`${
									isCurrent
										? "text-green-600 font-semibold"
										: isCompleted
										? "text-gray-800"
										: "text-gray-600"
								}`}
							>
								{step.label}
							</NavLink>
						</li>
					);
				})}
			</ol>
		</aside>
	);
};

export default Sidebar;
