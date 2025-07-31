export default function SmallButton({
	children,
	variant = "solid",
	color = "darkblue",
	className = "",
	...props
}) {
  const base = "w-full xl:w-48 py-2 rounded-md font-medium transition focus:outline-none text-center cursor-pointer px-2";

	const colorMap = {
		green: {
			solid:
				"bg-green-500 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300",
			outline:
				"border border-green-500 text-green-500 bg-white hover:bg-green-700 hover:text-white focus:ring-2 focus:ring-green-300",
			ghost: "border bg-transparent text-gray-700 hover:bg-gray-200",
		},
		blue: {
			solid:
				"bg-blue-500 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300",
			outline:
				"border border-blue-500 text-blue-500 bg-white hover:bg-blue-700 hover:text-white focus:ring-2 focus:ring-blue-300",
			ghost: "border bg-transparent text-gray-700 hover:bg-gray-200",
		},
		darkblue: {
			solid:
				"bg-[#0B1761] text-white hover:bg-[#091355] focus:ring-2 focus:ring-[#0B1761]",
			outline:
				"border border-[#0B1761] text-[#0B1761] bg-white hover:bg-[#091355] hover:text-white focus:ring-2 focus:ring-[#0B1761]",
			ghost: "border bg-transparent text-gray-700 hover:bg-gray-200",
		},
		deepblue: {
			solid:
				"bg-[#203b6b] text-white hover:bg-[#091355] focus:ring-2 focus:ring-[#203b6b]",
			outline:
				"border border-[#203b6b] text-[#203b6b] bg-white hover:bg-[#091355] hover:text-white focus:ring-2 focus:ring-[#203b6b]",
			ghost: "border bg-transparent text-gray-700 hover:bg-gray-200",
		},
		gray: {
			solid:
				"bg-gray-500 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-300",
			outline:
				"border border-gray-500 bg-white hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-300",
			ghost:
				"border border-gray-500 bg-transparent text-gray-700 hover:bg-gray-200",
			},
			red: {
				solid:
					"bg-red-500 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-300",
				outline:
					"border border-red-500 bg-white hover:bg-red-700 hover:text-white focus:ring-2 focus:ring-red-300",
				ghost:
					"border border-gray-500 bg-transparent text-gray-700 hover:bg-red-200 hover:text-black",
			},
	};

	return (
		<button
			className={`${base} ${colorMap[color][variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}