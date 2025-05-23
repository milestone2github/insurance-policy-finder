import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setPersonalData } from "../../store/PersonalSlice";
import { defaultProfilesMap } from "../../utils/constants";
import type { ProfileType, PersonalData } from "../../utils/interfaces";
import { iconMap } from "../../components/shared/ProfileButton";

export const defaultProfilesObjectMap: Record<
	ProfileType,
	{ label: string; countable: boolean }
> = defaultProfilesMap.reduce((acc, { profileType, label, countable }) => {
	acc[profileType] = { label, countable };
	return acc;
}, {} as Record<ProfileType, { label: string; countable: boolean }>);

const genderOptions: Record<ProfileType, string[]> = {
	father: ["male"],
	mother: ["female"],
	son: ["male"],
	daughter: ["female"],
	myself: ["male", "female", "other"],
	spouse: ["male", "female", "other"],
};

const NamesInput = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const selection = useSelector(
		(state: RootState) => state.profileSelection.profiles
	);

	const personalDetails = useSelector(
		(state: RootState) => state.personal.personalDetails
	);

	const [formData, setFormData] = useState(() => {
		const initialData: Record<ProfileType, PersonalData[]> = {} as any;

		Object.entries(selection).forEach(([key, val]) => {
			if (val.selected) {
				const countable =
					defaultProfilesObjectMap[key as ProfileType].countable;
				const count =
					countable && (key === "son" || key === "daughter")
						? val.count ?? 1
						: 1;

				initialData[key as ProfileType] = Array.from(
					{ length: count },
					(_, i) => {
						const savedData = personalDetails[key as ProfileType];

						// Handle if savedData is an array or single object
						if (Array.isArray(savedData)) {
							return (
								savedData[i] ?? {
									name: "",
									dob: "",
									gender: genderOptions[key as ProfileType][0],
									pincode: "",
								}
							);
						} else if (savedData) {
							// Single saved object, use for first index only
							return i === 0
								? savedData
								: {
										name: "",
										dob: "",
										gender: genderOptions[key as ProfileType][0],
										pincode: "",
								  };
						}

						// Default blank object
						return {
							name: "",
							dob: "",
							gender: genderOptions[key as ProfileType][0],
							pincode: "",
						};
					}
				);
			}
		});

		return initialData;
	});

	const handleChange = (
		key: ProfileType,
		index: number,
		field: keyof PersonalData,
		value: string
	) => {
		setFormData((prev) => {
			const updated = [...prev[key]];
			updated[index] = {
				...updated[index],
				[field]: value,
			};
			return {
				...prev,
				[key]: updated,
			};
		});
	};

	const handleNext = () => {
		Object.entries(formData).forEach(([key, profiles]) => {
			const type = key as ProfileType;
			profiles.forEach((data) => {
				dispatch(setPersonalData({ profileType: type, data }));
			});
		});

		navigate("/lifestyle");
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h2 className="text-2xl font-semibold mb-4">
				Enter details for each member
			</h2>
			{Object.entries(formData).map(([key, profiles]) => (
				<div key={key} className="mb-6">
					{profiles.map((profile, idx) => {
						const profileType = key as ProfileType;
						const label =
							defaultProfilesObjectMap[profileType].label +
							(profiles.length > 1 ? ` ${idx + 1}` : "");

						return (
							<div
								key={idx}
								className="grid grid-cols-6 sm:grid-cols-6 gap-4 items-center mb-4"
							>
								<div className="flex items-center justify-center">
									<img
										src={iconMap[key as ProfileType]}
										alt={key}
										className="w-10 h-10 rounded-full object-cover"
									/>
								</div>

								<div className="font-semibold capitalize">{label}</div>

								<input
									type="text"
									placeholder="Name"
									value={profile.name}
									onChange={(e) =>
										handleChange(profileType, idx, "name", e.target.value)
									}
									className="border p-2 rounded w-full"
								/>

								<input
									type="date"
									value={profile.dob}
									onChange={(e) =>
										handleChange(profileType, idx, "dob", e.target.value)
									}
									className="border p-2 rounded w-full"
								/>

								<select
									value={profile.gender}
									onChange={(e) =>
										handleChange(profileType, idx, "gender", e.target.value)
									}
									className="border p-2 rounded w-full"
								>
									{genderOptions[profileType].map((g) => (
										<option key={g} value={g}>
											{g.charAt(0).toUpperCase() + g.slice(1)}
										</option>
									))}
								</select>

								<input
									type="text"
									placeholder="Pincode"
									value={profile.pincode}
									onChange={(e) =>
										handleChange(profileType, idx, "pincode", e.target.value)
									}
									className="border p-2 rounded w-full"
								/>
							</div>
						);
					})}
				</div>
			))}

			<div className="flex justify-end">
				<button
					onClick={handleNext}
					className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default NamesInput;