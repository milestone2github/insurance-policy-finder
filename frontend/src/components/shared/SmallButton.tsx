type Variant = "solid" | "outline" | "ghost";
type Color = "green" | "blue" | "gray";

interface SmallButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	variant?: Variant;
	color?: Color;
	className?: string;
}

export default function SmallButton({
	children,
	variant = "solid",
	color = "blue",
	className = "",
	...props
}: SmallButtonProps) {
	// const base = "px-4 py-2 rounded-md font-medium transition focus:outline-none";
  const base = "w-32 py-2 rounded-md font-medium transition focus:outline-none text-center";

	const colorMap: Record<
		Color,
		{ solid: string; outline: string; ghost: string }
	> = {
		green: {
			solid: "bg-green-500 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300",
			outline: "border border-green-500 text-green-500 bg-white hover:bg-green-700 hover:text-white focus:ring-2 focus:ring-green-300",
			ghost: "border bg-transparent text-gray-700 hover:bg-gray-200",
		},
		blue: {
			solid: "bg-blue-500 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300",
			outline: "border border-blue-500 text-blue-500 bg-white hover:bg-blue-700 hover:text-white focus:ring-2 focus:ring-blue-300",
			ghost: "border bg-transparent text-gray-700 hover:bg-gray-200",
		},
		gray: {
			solid: "bg-gray-500 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-300",
			outline: "border border-gray-500 text-gray-500 bg-white hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-gray-300",
			ghost: "border bg-transparent text-gray-700 hover:bg-gray-200",
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

// type Variant = 'solid' | 'outline';

// interface SmallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: React.ReactNode;
//   variant?: Variant;
//   className?: string;
// }

// export default function SmallButton({
//   children,
//   variant = 'solid',
//   className = '',
//   ...props
// }: SmallButtonProps) {
//   const base = 'px-4 py-2 rounded-md font-medium transition focus:outline-none';
//   const styles: Record<Variant, string> = {
//     solid:
//       'bg-green-500 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-300',
//     outline:
//       'border border-green-500 text-green-500 bg-white hover:bg-green-700 hover:text-white focus:ring-2 focus:ring-green-300',
//   };

//   return (
//     <button
//       className={`${base} ${styles[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }
