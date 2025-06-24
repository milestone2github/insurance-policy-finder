import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "../../store";
import SmallButton from "../../components/shared/SmallButton";
import SharedOptions from "../../components/shared/SharedOptions";
import {
	setFullLifestyleData,
} from "../../store/LifestyleSlice";
import type { LifestyleOption, ProfileType } from "../../utils/interfaces";
import { resetAllState } from "../../store/resetSlice";
import toast from "react-hot-toast";

const fitnessOptions: LifestyleOption[] = [
	"Fit",
	"Underweight",
	"Overweight",
	"Obese",
];

const LifestyleInput = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const profileData = useSelector(
		(state: RootState) => state.profiles.profileData
	);
	const personalInfo = useSelector(
		(state: RootState) => state.personal.personalInfo
	);
	const reduxLifestyleData = useSelector(
		(state: RootState) => state.lifestyle.lifestyleData
	);

	const [formData, setFormData] = useState<{ [key: string]: LifestyleOption }>(
		{}
	);

	const selectedProfileKeys: string[] = Object.entries(profileData).flatMap(
		([key, value]) =>
			value.selected
				? value.countable
					? Array.from({ length: value.count }, (_, i) => `${key}-${i + 1}`)
					: [key]
				: []
	);

	const allProfiles = selectedProfileKeys.map((profileKey) => {
		const baseType = profileKey.includes("-")
			? (profileKey.split("-")[0] as ProfileType)
			: (profileKey as ProfileType);
		return {
			profileKey,
			profileType: baseType,
			data: personalInfo[profileKey],
			index: profileKey.includes("-")
				? parseInt(profileKey.split("-")[1], 10) - 1
				: 0,
		};
	});

	useEffect(() => {
		// if (!profileData || Object.keys(profileData).length === 0) {
		// 	navigate("/");
		// 	return;
		// }
		const hasSelected = Object.values(profileData).some((p) => p.selected);
		if (!hasSelected) {
			dispatch(resetAllState());
			navigate("/");
			return;
		}

		// dispatch(resetLifestyleData("RESET"));

		const initialFormData: { [key: string]: LifestyleOption } = {};
		selectedProfileKeys.forEach((key) => {
			const val = reduxLifestyleData?.[key];
			if (val && typeof val === "string") {
				initialFormData[key] = val as LifestyleOption;
			}
		});

		setFormData(initialFormData);
	}, [dispatch, reduxLifestyleData, navigate]);

	const handleOptionSelect = (profileKey: string, value: LifestyleOption) => {
		setFormData((prev) => ({ ...prev, [profileKey]: value }));
		toast.dismiss();
	};

	const handleNext = () => {
		console.log("Form Data for lifestyle: ===> ", formData);
		const allSelected = selectedProfileKeys.every((key) => !!formData[key]);

		if (!allSelected) {
			toast.error("Please select a fitness level for all members before continuing.");
			return;
		}

		dispatch(setFullLifestyleData(formData));
		navigate("/lifestyle/habit-history-1");
	};

	const handlePrev = () => {
		dispatch(setFullLifestyleData(formData));
		navigate("/personal/input-names");
	};

	return (
		<div className="flex flex-col max-w-5xl mx-auto h-[calc(100vh-4rem)] p-6">
			<div className="text-center text-2xl font-semibold text-gray-900 mb-6">
				<h2>
					What’s your family’s current level of{" "}
					<span className="text-[#0B1761]">fitness</span> ?
				</h2>
				<p className="text-sm text-gray-500 mt-2">
					Recommended plans will be based on your family’s fitness and lifestyle
					habits.
				</p>
			</div>

			<div className="flex-1 overflow-hidden">
				<div className="bg-white rounded-lg shadow-sm h-[calc(100%-1rem)] overflow-y-auto p-6 space-y-6 border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
					<SharedOptions
						profiles={allProfiles}
						selectionLabels={profileData}
						options={fitnessOptions}
						formData={formData}
						onOptionSelect={(profileType, index, value) => {
							const profileKey =
								profileType === "son" || profileType === "daughter"
									? `${profileType}-${index + 1}`
									: profileType;
							handleOptionSelect(profileKey, value);
						}}
					/>
				</div>
			</div>

			<div className="border-t border-gray-200 mt-4 pt-4">
				<div className="flex justify-center gap-5">
					<SmallButton onClick={handlePrev} variant="ghost" color="gray">
						Previous
					</SmallButton>
					<SmallButton onClick={handleNext} color="darkblue">
						Next
					</SmallButton>
				</div>
			</div>
		</div>
	);
};

export default LifestyleInput;
