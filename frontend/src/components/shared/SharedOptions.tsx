// Improvement: Transfer to NewSharedComponent
import { calculateAge } from "../../utils/calculateAge";
import SmallButton from "./SmallButton";
import type { ProfileType } from "../../utils/interfaces";
import { iconMap } from "../../utils/constants";

interface ProfileData {
	profileKey: string;
	profileType: ProfileType;
	data: any;
	index: number;
}

interface SharedOptionsProps<OptionValue extends string> {
	profiles: ProfileData[];
	selectionLabels: Record<string, { label: string }>;
	options: OptionValue[];
	formData: Record<string, OptionValue>;
	onOptionSelect: (
		profileType: ProfileType,
		index: number,
		value: OptionValue
	) => void;
}

const SharedOptions = <OptionValue extends string>({
	profiles,
	selectionLabels,
	options,
	formData,
	onOptionSelect,
}: SharedOptionsProps<OptionValue>) => {
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

				return (
					<div
						key={profileKey}
						className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50 shadow"
					>
						<img
							src={iconMap[profileType]}
							alt={profileType}
							className="w-14 h-14 rounded-full object-cover"
						/>
						<div className="min-w-[160px] font-semibold capitalize">
							{label}{" "}
							<span className="text-sm text-gray-500">({age} yrs.)</span>
						</div>
						<div className="w-full flex gap-2 flex-wrap">
							{options.map((option) => (
								<SmallButton
									key={option}
									color={selectedValue === option ? "blue" : "gray"}
									variant={selectedValue === option ? "solid" : "ghost"}
									onClick={() => onOptionSelect(profileType, index, option)}
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

export default SharedOptions;
