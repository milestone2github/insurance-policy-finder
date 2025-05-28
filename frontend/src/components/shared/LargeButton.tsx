import { Check } from "lucide-react";

type LargeButtonProps = {
	label: string;
	selected: boolean;
	onClick: () => void;
};

export default function LargeButton({
	label,
	selected,
	onClick,
}: LargeButtonProps) {
	return (
		<div
			role="button"
			aria-pressed={selected}
			onClick={onClick}
			className={`
        relative
        bg-white
        rounded-xl
        shadow-sm
        hover:shadow-md
        cursor-pointer
        px-18 py-10
        flex items-center justify-center
        transition
        ${selected ? "border-2 border-blue-500" : "border border-gray-200"}
      `}
		>
			{selected && (
				<div className="absolute -top-1.5 -left-1.5 bg-blue-500 rounded-full p-1">
					<Check className="w-4 h-4 text-white" />
				</div>
			)}
			<span
				className={`font-semibold ${
					selected ? "text-gray-900" : "text-gray-700"
				}`}
			>
				{label}
			</span>
		</div>
	);
}
