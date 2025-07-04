// Profile Selection Buttons
import React from "react";
import type { ProfileButtonProps, ProfileType } from "../../utils/interfaces";
import { defaultProfilesMap, iconMap } from "../../utils/constants";

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

	// const isCountable = profileType === "son" || profileType === "daughter";
	const isCountable =
		defaultProfilesMap.find((p) => p.profileType === profileType)?.countable ===
		true;
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
			</div>

			{/* <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 sm:text-left sm:ml-4 sm:pl-6 sm:w-full items-center justify-center text-center"> */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:gap-6 lg:text-left lg:ml-4 lg:pl-6 lg:w-full items-center justify-center text-center">
				<div
					className="text-[0.8rem] font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-[6rem] lg:max-w-full"
					title={label}
				>
					{label}
				</div>

				{isCountable && !selectMode && (
					<div
						className="mt-1 sm:mt-0 flex items-center space-x-1 sm:space-x-2"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => onCountChange?.(-1)}
							disabled={count <= 0}
						>
							–
						</button>
						<span className="w-4 text-center text-sm">{count}</span>
						<button
							className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => onCountChange?.(1)}
							disabled={count >= 5}
						>
							+
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfileSelection;
