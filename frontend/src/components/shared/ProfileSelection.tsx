// Profile Selection Buttons
import React from "react";
import type { ProfileButtonProps, ProfileType } from "../../utils/interfaces";
import { iconMap } from "../../utils/constants";

const ProfileSelection: React.FC<ProfileButtonProps> = ({
	profileType,
	label,
	selected,
	count = 0,
	onSelect,
	onCountChange,
	selectMode = false,
}) => {
	const baseType = profileType
		? (profileType.split("-")[0] as ProfileType)
		: (profileType as ProfileType);

	const isCountable = profileType === "son" || profileType === "daughter";
	const iconSrc = iconMap[baseType];
	const effectiveSelected = isCountable && !selectMode ? count > 0 : selected;

	return (
		<div
			onClick={onSelect}
			className={`border rounded-xl px-4 py-4 cursor-pointer flex items-center justify-between w-full transition ${
				effectiveSelected
					? "border-[#203b6b] bg-blue-50"
					: "border-gray-300 bg-white hover:bg-gray-50"
			}`}
		>
			<div className="flex items-center gap-4 overflow-hidden">
				<img
					src={iconSrc}
					alt={label}
					className="h-10 w-10 rounded-full object-cover"
				/>
				<div className="text-sm font-medium text-gray-800 whitespace-nowrap">
					{label}
				</div>
			</div>

			{/* Son/Daughter Counter */}
			{isCountable && !selectMode && (
				<div
					className="flex items-center space-x-2"
					onClick={(e) => e.stopPropagation()}
				>
					<button
						className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => onCountChange?.(-1)}
						disabled={count <= 0}
					>
						–
					</button>
					<span className="w-4 text-center">{count}</span>
					<button
						className="px-2 py-1 text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={() => onCountChange?.(1)}
						disabled={count >= 5}
					>
						+
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileSelection;
