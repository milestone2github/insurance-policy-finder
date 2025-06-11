// Simpler SharedOption generic component

import { calculateAge } from "../../utils/calculateAge";
import SmallButton from "./SmallButton";
import type { ProfileType } from "../../utils/interfaces";
import { iconMap } from "../../utils/constants";

interface ProfileData {
	profileName: string;
	data: any;
}

interface SharedOptionsProps<OptionValue extends string> {
	profiles: ProfileData[];
	options: OptionValue[];
	onOptionSelect: (profileName: string, value: OptionValue) => void;
	selectedValues: Record<string, OptionValue>;
}

const NewSharedOptions = <OptionValue extends string>({
	profiles,
	options,
	onOptionSelect,
	selectedValues,
}: SharedOptionsProps<OptionValue>) => {
	return (
		<div className="space-y-6">
			{profiles.map(({ profileName, data }) => {
				const baseType = profileName.split("-")[0] as ProfileType;
				const iconSrc = iconMap[baseType];
				const age = calculateAge(data?.dob);
				const selectedValue = selectedValues[profileName];

				return (
					<div
						key={profileName}
						className="flex items-center gap-4 p-4 border border-gray-400 rounded-lg bg-gray-50 shadow"
					>
						<img
							src={iconSrc}
							alt={baseType}
							className="w-14 h-14 rounded-full object-cover"
						/>
						<div className="min-w-[160px] font-semibold capitalize">
							{data?.name}
							<span className="text-sm text-gray-500"> ({age} yrs.)</span>
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
				);
			})}
		</div>
	);
};

export default NewSharedOptions;
