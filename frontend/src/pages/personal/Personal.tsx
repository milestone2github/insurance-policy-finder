import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import type { RootState } from "../../store";
import {
	setPersonalData,
	syncPersonalDataWithSelection,
} from "../../store/PersonalSlice";
import { PROFILE_LABELS, genderOptions, iconMap } from "../../utils/constants";
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

	const renderProfileLabel = (key: string): string => {
		if (["myself", "spouse", "father", "mother"].includes(key)) {
			const info = personalInfo[key];
			return (
				info?.name || PROFILE_LABELS[key as keyof typeof PROFILE_LABELS] || key
			);
		}
		if (key.startsWith("son-")) {
			const index = key.split("-")[1];
			return personalInfo[key]?.name || `Son-${index}`;
		}
		if (key.startsWith("daughter-")) {
			const index = key.split("-")[1];
			return personalInfo[key]?.name || `Daughter-${index}`;
		}
		return key;
	};

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
		<div className="p-6 max-w-5xl mx-auto">
			<h2 className="text-2xl font-semibold mb-4">
				Enter details for each member
			</h2>

			{Object.entries(formData).map(([key, data]) => (
				<div
					key={key}
					className="flex items-center gap-4 my-10 p-4 border rounded-lg bg-slate-50 shadow"
				>
					<img
						src={iconMap[key.split("-")[0] as keyof typeof iconMap]}
						alt={key}
						className="w-14 rounded-full object-cover"
					/>

					<div className="font-semibold capitalize w-28 px-1">
						{renderProfileLabel(key)}
					</div>

					<input
						type="text"
						placeholder="Name"
						value={data.name || ""}
						onChange={(e) => handleChange(key, "name", e.target.value)}
						className="border p-2 rounded flex-1 min-w-[140px]"
					/>

					<input
						type="date"
						value={data.dob || ""}
						onChange={(e) => handleChange(key, "dob", e.target.value)}
						max={new Date().toISOString().split("T")[0]}
						className="border p-2 rounded flex-1 min-w-[140px]"
					/>

					<select
						value={data.gender}
						onChange={(e) => handleChange(key, "gender", e.target.value)}
						className="border p-2 rounded flex-1 min-w-[120px]"
					>
						{getGenderOptions(key).map((g) => (
							<option key={g} value={g}>
								{g.charAt(0).toUpperCase() + g.slice(1)}
							</option>
						))}
					</select>

					<input
						type="text"
						placeholder="Pincode"
						value={data.pincode || ""}
						onChange={(e) => {
							const value = e.target.value.replace(/\D/g, "").slice(0, 6);
							handleChange(key, "pincode", value);
						}}
						className="border p-2 rounded flex-1 min-w-[120px]"
						maxLength={6}
					/>
				</div>
			))}

			<div className="flex justify-center gap-5 mt-3">
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

export default Personal;
