import React from "react";
import { Check } from "lucide-react";
import SelfIcon from "../../assets/icons/SelfIcon.png";
import SpouseIcon from "../../assets/icons/SpouseIcon.png";
import FatherIcon from "../../assets/icons/FatherIcon.png";
import MotherIcon from "../../assets/icons/MotherIcon.png";
import SonIcon from "../../assets/icons/SonIcon.png";
import DaughterIcon from "../../assets/icons/DaughterIcon.png";
import type { ProfileButtonProps, ProfileType } from "../../utils/interfaces";

export const iconMap: Record<ProfileType, string> = {
	myself: SelfIcon,
	spouse: SpouseIcon,
	son: SonIcon,
	daughter: DaughterIcon,
	father: FatherIcon,
	mother: MotherIcon,
};

const ProfileButton: React.FC<ProfileButtonProps> = ({
	profileType,
	// profileKey,
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
	// console.log("Profile Key ==> ", profileKey);
	// const baseType = (profileKey?.split("-")[0] as ProfileType) || profileType;
	// console.log("Base Type ==> ", baseType);
	const iconSrc = iconMap[baseType];
	const effectiveSelected = isCountable && !selectMode ? count > 0 : selected;

	return (
		<div className="relative">
			{effectiveSelected && (
				<div className="absolute top-2 left-2 bg-blue-200 rounded-full p-1 z-10">
					<Check className="w-4 h-4 text-blue-600" />
				</div>
			)}
			<div
				className={`border rounded-xl p-5 m-3 cursor-pointer text-center w-36 h-44 flex flex-col items-center justify-between ${
					effectiveSelected ? "border-blue-500 bg-green-50" : "border-gray-300"
				}`}
				onClick={onSelect}
			>
				<img
					src={iconSrc}
					alt={label}
					className="h-20 w-20 rounded-full object-cover"
				/>
				<div className="font-semibold mt-2">{label}</div>

				{isCountable && !selectMode && (
					<div
						className="flex justify-center items-center mt-2 space-x-2"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className={`px-2 rounded-full ${
								count <= 0
									? "bg-gray-100 text-gray-400 cursor-not-allowed"
									: "bg-gray-300"
							}`}
							onClick={() => onCountChange?.(-1)}
							disabled={count <= 0}
						>
							-
						</button>
						<span>{count}</span>
						<button
							className={`px-2 rounded-full ${
								count >= 5
									? "bg-gray-100 text-gray-400 cursor-not-allowed"
									: "bg-gray-300"
							}`}
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

export default ProfileButton;

// import React from "react";
// import { Check } from "lucide-react";
// import SelfIcon from "../../assets/icons/SelfIcon.png";
// import SpouseIcon from "../../assets/icons/SpouseIcon.png";
// import FatherIcon from "../../assets/icons/FatherIcon.png";
// import MotherIcon from "../../assets/icons/MotherIcon.png";
// import SonIcon from "../../assets/icons/SonIcon.png";
// import DaughterIcon from "../../assets/icons/DaughterIcon.png";
// import type { ProfileButtonProps, ProfileType } from "../../utils/interfaces";

// export const iconMap: Record<ProfileType, string> = {
// 	myself: SelfIcon,
// 	spouse: SpouseIcon,
// 	son: SonIcon,
// 	daughter: DaughterIcon,
// 	father: FatherIcon,
// 	mother: MotherIcon,
// };

// const ProfileButton: React.FC<ProfileButtonProps> = ({
// 	profileType,
// 	label,
// 	selected,
// 	count = 0,
// 	onSelect,
// 	onCountChange,
// 	selectMode = false
// }) => {
// 	const isCountable = profileType === "son" || profileType === "daughter";
// 	const iconSrc = iconMap[profileType];
// 	const effectiveSelected =
// 		(profileType === "son" || profileType === "daughter") && !selectMode
// 			? (count ?? 0) > 0
// 			: selected;
// 	return (
// 		<div className="relative">
// 			{effectiveSelected && (
// 				<div className="absolute top-2 left-2 bg-blue-200 rounded-full p-1 z-10">
// 					<Check className="w-4 h-4 text-blue-600" />
// 				</div>
// 			)}
// 			<div
// 				className={`border rounded-xl p-5 m-3 cursor-pointer text-center w-36 h-44 flex flex-col items-center justify-between ${
// 					effectiveSelected ? "border-blue-500 bg-green-50" : "border-gray-300"
// 				}`}
// 				onClick={onSelect}
// 			>
// 				<img
// 					src={iconSrc}
// 					// src={iconMap[profileKey.split("-")[0] as keyof typeof iconMap]}
// 					alt={label}
// 					className="h-20 w-20 rounded-full object-cover"
// 				/>
// 				<div className="font-semibold mt-2">{label}</div>

// 				{isCountable && !selectMode && (
// 					<div
// 						className="flex justify-center items-center mt-2 space-x-2"
// 						onClick={(e) => e.stopPropagation()}
// 					>
// 						<button
// 							className={`px-2 rounded-full ${
// 								count <= 0
// 									? "bg-gray-100 text-gray-400 cursor-not-allowed"
// 									: "bg-gray-300"
// 							}`}
// 							onClick={() => onCountChange?.(-1)}
// 							disabled={count <= 0}
// 						>
// 							-
// 						</button>
// 						<span>{count}</span>
// 						<button
// 							className={`px-2 rounded-full ${
// 								count >= 5
// 									? "bg-gray-100 text-gray-400 cursor-not-allowed"
// 									: "bg-gray-300"
// 							}`}
// 							onClick={() => onCountChange?.(1)}
// 							disabled={count >= 5}
// 						>
// 							+
// 						</button>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default ProfileButton;
