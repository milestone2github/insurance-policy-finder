import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import type { RootState } from "../../store";
import {
	setPersonalData,
	syncPersonalDataWithSelection,
} from "../../store/PersonalSlice";
// import { PROFILE_LABELS, genderOptions, iconMap } from "../../utils/constants";
import { genderOptions, iconMap } from "../../utils/constants";
import type { PersonalData } from "../../utils/interfaces";
import SmallButton from "../../components/shared/SmallButton";
import { calculateAge } from "../../utils/calculateAge";

const Personal = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const profileData = useSelector(
		(state: RootState) => state.profiles.profileData
	);
	const personalInfo = useSelector(
		(state: RootState) => state.personal.personalInfo
	);

	const [formData, setFormData] = useState<Record<string, PersonalData>>({});

	useEffect(() => {
		const hasSelected = Object.values(profileData).some((p) => p.selected);
		if (!hasSelected) {
			navigate("/");
		} else {
			const selection = Object.entries(profileData).reduce(
				(acc, [key, value]) => {
					if (value.selected) {
						acc[key] = { selected: value.selected, count: value.count };
					}
					return acc;
				},
				{} as Record<string, { selected: boolean; count: number }>
			);
			dispatch(syncPersonalDataWithSelection(selection as any));
		}
	}, [dispatch, profileData, navigate]);

	useEffect(() => {
		setFormData(personalInfo);
	}, [personalInfo]);

	const handleChange = (
		key: string,
		field: keyof PersonalData,
		value: string
	) => {
		setFormData((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				[field]: value,
			},
		}));
		toast.dismiss();
	};

	// const renderProfileLabel = (key: string): string => {
	// 	if (["myself", "spouse", "father", "mother"].includes(key)) {
	// 		const info = personalInfo[key];
	// 		return (
	// 			info?.name || PROFILE_LABELS[key as keyof typeof PROFILE_LABELS] || key
	// 		);
	// 	}
	// 	if (key.startsWith("son-")) {
	// 		const index = key.split("-")[1];
	// 		return personalInfo[key]?.name || `Son-${index}`;
	// 	}
	// 	if (key.startsWith("daughter-")) {
	// 		const index = key.split("-")[1];
	// 		return personalInfo[key]?.name || `Daughter-${index}`;
	// 	}
	// 	return key;
	// };

	const getGenderOptions = (key: string) => {
		if (key.startsWith("son")) return genderOptions.son;
		if (key.startsWith("daughter")) return genderOptions.daughter;
		return (
			genderOptions[key as keyof typeof genderOptions] || ["male", "female"]
		);
	};

	const handleNext = () => {
		let isValid = true;

		Object.entries(formData).forEach(([_, profile]) => {
			if (!profile.name || !profile.dob || !profile.gender) {
				isValid = false;
			}
		});

		if (!isValid) {
			toast.error("Please fill all required fields before continuing.");
			return;
		}

		let isValidAge = true;

		Object.entries(formData).forEach(([profileKey, data]) => {
			if (
				(profileKey === "myself" || profileKey === "spouse") &&
				calculateAge(data.dob) < 18
			) {
				isValidAge = false;
			}
		});

		if (!isValidAge) {
			toast.error("Your's or Spouse's age is less than 18.");
			return;
		}

		Object.entries(formData).forEach(([profileKey, data]) => {
			dispatch(setPersonalData({ profileKey, data }));
		});

		navigate("/lifestyle");
	};

	const handlePrev = () => {
		Object.entries(formData).forEach(([profileKey, data]) => {
			dispatch(setPersonalData({ profileKey, data }));
		});
		navigate("/");
	};

	return (
		<div className="flex flex-col max-w-5xl mx-auto h-[calc(100vh-4rem)] p-6">
			<div className="flex justify-center text-2xl font-semibold text-gray-900 mb-6">
				<h2 className="">
					Let's get to know your family{" "}
					<span className="text-[#0B1761]">better</span>
				</h2>
			</div>

			<div className="flex-1 overflow-hidden">
				<div className="bg-white rounded-lg shadow-sm h-[calc(100%-1rem)] overflow-y-auto p-6 space-y-6 border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
					{Object.entries(formData).map(([key, data], index) => (
						<div key={key}>
							<div className="flex items-center gap-3">
								<img
									src={iconMap[key.split("-")[0] as keyof typeof iconMap]}
									alt={key}
									className="w-14 rounded-full object-cover"
								/>

								<div className="font-semibold capitalize w-28 px-1 text-gray-600 text-sm">
									{key.replace(/-/g, " ")}
								</div>

								<div className="relative flex-1 min-w-[160px]">
									<label className="absolute -top-2 left-2 px-1 text-xs text-gray-500 bg-white">
										Full Name *
									</label>
									<input
										type="text"
										value={data.name || ""}
										onChange={(e) => handleChange(key, "name", e.target.value)}
										className="border border-gray-400 rounded p-1.5 pt-3 w-full text-md"
									/>
								</div>

								<div className="relative flex-1 min-w-[160px]">
									<label className="absolute -top-2 left-2 px-1 text-xs text-gray-500 bg-white">
										DOB (DD-MM-YYYY) *
									</label>
									<input
										type="date"
										value={data.dob || ""}
										onChange={(e) => handleChange(key, "dob", e.target.value)}
										max={new Date().toISOString().split("T")[0]}
										className="border border-gray-400 rounded p-1.5 pt-3 w-full text-md"
									/>
								</div>

								<div className="relative flex-1 min-w-[140px]">
									<label className="absolute -top-2 left-2 px-1 text-xs text-gray-500 bg-white">
										Gender *
									</label>
									<select
										value={data.gender}
										onChange={(e) =>
											handleChange(key, "gender", e.target.value)
										}
										className="border border-gray-400 rounded p-1.5 pt-3 w-full text-md"
									>
										{getGenderOptions(key).map((g) => (
											<option key={g} value={g}>
												{g.charAt(0).toUpperCase() + g.slice(1)}
											</option>
										))}
									</select>
								</div>

								<div className="relative flex-1 min-w-[140px]">
									<label className="absolute -top-2 left-2 px-1 text-xs text-gray-500 bg-white">
										Pincode
									</label>
									<input
										type="text"
										value={data.pincode || ""}
										onChange={(e) => {
											const value = e.target.value
												.replace(/\D/g, "")
												.slice(0, 6);
											handleChange(key, "pincode", value);
										}}
										className="border border-gray-400 rounded p-1.5 pt-3 w-full text-md"
										maxLength={6}
									/>
								</div>
							</div>

							{index !== Object.entries(formData).length - 1 && (
								<div className="border-t mt-6 border-gray-200" />
							)}
						</div>
					))}
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

export default Personal;
