import { useState } from "react";
import { calculateAge } from "../../utils/calculateAge";
import SmallButton from "./SmallButton";
import { iconMap } from "../../utils/constants";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const NewSharedOptions = ({
	profiles,
	options,
	onOptionSelect,
	selectedValues,
}) => {
	const [openKeys, setOpenKeys] = useState([]);

	const toggleOpen = (key) => {
		setOpenKeys((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);
	};

	return (
		<div className="space-y-6">
			{profiles.map(({ profileName, data }) => {
				const baseType = profileName.split("-")[0];
				const iconSrc = iconMap[baseType];
				const age = calculateAge(data?.dob);
				const selectedValue = selectedValues[profileName];
				// const isOpen = openKeys.includes(profileName);
				const isOpen = openKeys.includes(profileName) ||
					(openKeys.length === 0 && profiles[0].profileName === profileName);

				return (
					<div key={profileName}>
						{/* Collapsible view (for below lg) */}
						<div className="block lg:hidden border border-gray-200 rounded-lg overflow-hidden">
							<div
								className="flex items-center justify-between p-4 bg-white cursor-pointer"
								onClick={() => toggleOpen(profileName)}
							>
								<div className="flex items-center gap-3">
									<img
										src={iconSrc}
										alt={baseType}
										className="w-10 rounded-full object-cover"
									/>
									<div className="font-medium capitalize text-gray-800 text-sm">
										{data?.name}{" "}
										<span className="text-sm text-gray-500">({age} yrs.)</span>
									</div>
								</div>
								<span className="text-lg text-gray-500">
									{isOpen ? <FaChevronUp /> : <FaChevronDown />}
								</span>
							</div>

							{isOpen && (
								<div className="bg-white px-4 pb-4 pt-2 grid grid-cols-2 gap-3">
									{options.map((option) => (
										<SmallButton
											key={option}
											color={selectedValue === option ? "deepblue" : "gray"}
											variant={selectedValue === option ? "solid" : "ghost"}
											onClick={() => onOptionSelect(profileName, option)}
										>
											{option}
										</SmallButton>
									))}
								</div>
							)}
						</div>

						{/* Horizontal layout (for lg and above) */}
						<div className="hidden lg:flex items-center gap-6 p-4 border border-gray-400 rounded-lg bg-gray-50 shadow">
							<img
								src={iconSrc}
								alt={baseType}
								className="w-14 h-14 rounded-full object-cover"
							/>
							<div className="min-w-[160px] font-semibold capitalize">
								{data?.name}{" "}
								<span className="text-sm text-gray-500">({age} yrs.)</span>
							</div>
							<div className="w-full flex gap-2 flex-nowrap overflow-auto">
								{options.map((option) => (
									<SmallButton
										key={option}
										color={selectedValue === option ? "deepblue" : "gray"}
										variant={selectedValue === option ? "solid" : "ghost"}
										onClick={() => onOptionSelect(profileName, option)}
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

export default NewSharedOptions;
