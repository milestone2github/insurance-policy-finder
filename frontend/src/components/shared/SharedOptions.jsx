import { useState } from "react";
import { calculateAge } from "../../utils/calculateAge";
import SmallButton from "./SmallButton";
import { iconMap } from "../../utils/constants";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SharedOptions = ({
	profiles,
	selectionLabels,
	options,
	formData,
	onOptionSelect,
}) => {
	const [openKeys, setOpenKeys] = useState([]);

	const toggleOpen = (key) => {
		setOpenKeys((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);
	};

	return (
		<div className="space-y-6">
			{profiles.map(({ profileKey, profileType, data, index }) => {
				const labelBase = selectionLabels[profileType]?.label || profileType;
				const sameTypeCount = profiles.filter(
					(p) => p.profileType === profileType
				).length;
				const label =
					data?.name || labelBase + (sameTypeCount > 1 ? ` ${index + 1}` : "");
				const age = calculateAge(data?.dob);
				const selectedValue = formData[profileKey];
				const isOpen = openKeys.includes(profileKey) || profileKey === "myself";

				return (
					<div key={profileKey} className="space-y-2">
						{/* Mobile–lg: collapsible */}
						<div className="block lg:hidden border border-gray-300 rounded-lg overflow-hidden">
							<div
								className="flex justify-between items-center p-4 bg-white cursor-pointer"
								onClick={() => toggleOpen(profileKey)}
							>
								<div className="flex items-center gap-3">
									<img
										src={iconMap[profileType]}
										alt={profileType}
										className="w-10 h-10 rounded-full object-cover"
									/>
									<div className="font-semibold capitalize text-gray-800 text-sm">
										{label}{" "}
										<span className="text-xs text-gray-500">({age} yrs)</span>
									</div>
								</div>
								<span className="text-lg text-gray-500">
									{isOpen ? <FaChevronUp /> : <FaChevronDown />}
								</span>
							</div>

							{isOpen && (
								<div className="p-4 bg-gray-50 grid grid-cols-2 gap-3 sm:gap-4">
									{options.map((option) => (
										<SmallButton
											key={option}
											color={selectedValue === option ? "deepblue" : "gray"}
											variant={selectedValue === option ? "solid" : "ghost"}
											onClick={() => onOptionSelect(profileType, index, option)}
											className="w-full"
										>
											{option}
										</SmallButton>
									))}
								</div>
							)}
						</div>

						{/* lg+: original layout */}
						<div className="hidden lg:flex items-center gap-4 p-4 border border-gray-400 rounded-lg bg-gray-50 shadow">
							<img
								src={iconMap[profileType]}
								alt={profileType}
								className="w-14 h-14 rounded-full object-cover"
							/>
							<div className="min-w-[160px] font-semibold capitalize">
								{label}{" "}
								<span className="text-sm text-gray-500">({age} yrs.)</span>
							</div>
							<div className="w-full flex gap-2 flex-nowrap overflow-x-auto">
								{options.map((option) => (
									<SmallButton
										key={option}
										color={selectedValue === option ? "deepblue" : "gray"}
										variant={selectedValue === option ? "solid" : "ghost"}
										onClick={() => onOptionSelect(profileType, index, option)}
									>
										{option}
									</SmallButton>
								))}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SharedOptions;
