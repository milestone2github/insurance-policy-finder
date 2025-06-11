import { useLocation } from "react-router-dom";

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

	const progressPercent =
		currentIndex >= 0 ? ((currentIndex + 1) / allPaths.length) * 100 : 0;

	return (
		<div className="w-full">
			<div className="h-6 bg-[#2D3748]" />
			<div
				className="h-1 bg-orange-500 transition-all duration-300"
				style={{ width: `${progressPercent}%` }}
			/>
		</div>
	);
}
