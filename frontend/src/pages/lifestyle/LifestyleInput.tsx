import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../../store/index";
import { iconMap } from "../../components/shared/ProfileButton";
import SmallButton from "../../components/shared/SmallButton";
// import { setLifestyleData, setFullLifestyleData, type LifestyleOption } from "../../store/LifestyleSlice";
import { setFullLifestyleData } from "../../store/LifestyleSlice";
import { calculateAge } from "../../utils/calculateAge";
import type { LifestyleOption, ProfileType } from "../../utils/interfaces";

const fitnessOptions = ["Fit", "Underweight", "Overweight", "Obese"] as const;

const LifestyleInput = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const selection = useSelector(
		(state: RootState) => state.profiles.profileData
	);
	const personalInfo = useSelector(
		(state: RootState) => state.personal.personalInfo
	);
	const lifestyleData = useSelector(
		(state: RootState) => state.lifestyle.lifestyleData
	);

	// Local state to track form selections, same structure as lifestyleData but fully controlled
	const [formData, setFormData] = useState<{
		[key: string]: LifestyleOption | LifestyleOption[];
	}>({});

	// Prepare flat profiles list for rendering
	const allProfiles: {
		profileKey: string;
		profileType: ProfileType;
		data: any;
		index: number;
	}[] = [];

	Object.entries(personalInfo).forEach(([profileType, entry]) => {
		const entries = Array.isArray(entry) ? entry : [entry];
		entries.forEach((data, index) => {
			allProfiles.push({
				profileKey: `${profileType}_${index}`,
				profileType: profileType as ProfileType,
				data,
				index,
			});
		});
	});

	// On mount, sync local formData from Redux lifestyleData
	useEffect(() => {
		setFormData(lifestyleData);
	}, [lifestyleData]);

	// If no data is available, redirect to Home (Personal page)
	useEffect(() => {
		if (allProfiles.length === 0) {
			navigate("/");
		}
	}, [allProfiles, navigate]);

	// On option select:
	const handleOptionSelect = (
		profileType: ProfileType,
		index: number,
		value: LifestyleOption
	) => {
		const isChild = profileType === "son" || profileType === "daughter";

		let updatedFormData = { ...formData };

		if (isChild) {
			const arr = Array.isArray(updatedFormData[profileType])
				? [...(updatedFormData[profileType] as LifestyleOption[])]
				: [];
			arr[index] = value;
			updatedFormData[profileType] = arr;
		} else {
			updatedFormData[profileType] = value;
		}

		// Reset Redux state and push latest updatedFormData
		dispatch(setFullLifestyleData({})); // reset first
		dispatch(setFullLifestyleData(updatedFormData)); // then set updated

		setFormData(updatedFormData);
	};

	// const handleNext = () => {
	// 	console.log("Final lifestyle data:", formData);
	// 	navigate("/lifestyle/habit-history-1");
	// };

	// Ensures all the profiles have been with lifestyle data, OR redirect to home
	const handleNext = () => {
		let allSelected = true;

		for (const { profileType, index } of allProfiles) {
			if (profileType === "son" || profileType === "daughter") {
				const arr = formData[profileType] as LifestyleOption[] | undefined;
				if (!arr || !arr[index]) {
					allSelected = false;
					break;
				}
			} else {
				if (!formData[profileType]) {
					allSelected = false;
					break;
				}
			}
		}

		if (!allSelected) {
			alert(
				"Please select a fitness level for all profiles before continuing."
			);
			return;
		}

		navigate("/lifestyle/habit-history-1");
	};
	

	const handlePrev = () => {
		navigate("/personal/input-names");
	};

	return (
		<div className="p-8 max-w-4xl mx-auto my-auto">
			<h2 className="text-2xl font-semibold mb-6">Select Fitness Level</h2>
			<div className="space-y-6">
				{allProfiles.map(({ profileKey, profileType, data, index }) => {
					const labelBase = selection[profileType]?.label || profileType;
					const sameTypeCount = allProfiles.filter(
						(p) => p.profileType === profileType
					).length;
					const label =
						data.name || labelBase + (sameTypeCount > 1 ? ` ${index + 1}` : "");
					const age = calculateAge(data.dob);

					// Get current selection from formData:
					let selectedValue: LifestyleOption | undefined = undefined;
					if (profileType === "son" || profileType === "daughter") {
						const arr = formData[profileType];
						if (Array.isArray(arr)) selectedValue = arr[index];
					} else {
						selectedValue = formData[profileType] as LifestyleOption;
					}

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
								{fitnessOptions.map((option) => (
									<SmallButton
										key={option}
										color={selectedValue === option ? "blue" : "gray"}
										variant={selectedValue === option ? "solid" : "ghost"}
										onClick={() =>
											handleOptionSelect(profileType, index, option)
										}
									>
										{option}
									</SmallButton>
								))}
							</div>
						</div>
					);
				})}
			</div>

			<div className="flex justify-center gap-5 mt-10">
				<SmallButton onClick={handlePrev} variant="ghost" color="gray">
					Previous
				</SmallButton>
				<SmallButton onClick={handleNext} color="blue">
					Next
				</SmallButton>
			</div>
		</div>
	);
};

export default LifestyleInput;
