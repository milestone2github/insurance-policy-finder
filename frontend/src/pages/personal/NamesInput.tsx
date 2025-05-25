import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setPersonalData } from "../../store/PersonalSlice";
import { defaultProfilesMap, genderOptions } from "../../utils/constants";
import type { ProfileType, PersonalData } from "../../utils/interfaces";
import { iconMap } from "../../components/shared/ProfileButton";
import SmallButton from "../../components/shared/SmallButton";

// Selected profiles are shown with input data on 2nd page
const defaultProfilesObjectMap: Record<
	ProfileType,
	{ label: string; countable: boolean }
> = defaultProfilesMap.reduce((acc, { profileType, label, countable }) => {
	acc[profileType] = { label, countable };
	return acc;
}, {} as Record<ProfileType, { label: string; countable: boolean }>);

const NamesInput = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const selection = useSelector((state: RootState) => state.profiles.profileData);
	const personalDetails = useSelector((state: RootState) => state.personal.personalInfo);

	// FormData is a local state where data is fetched via Redux State for separate management
	const [formData, setFormData] = useState(() => {
		const initialData: Record<ProfileType, PersonalData[]> = {} as any;

		// Map the input divs with no. of selected profiles and empty values
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
							return i === 0
								? savedData
								: {
										name: "",
										dob: "",
										gender: genderOptions[key as ProfileType][0],
										pincode: "",
								  };
						}

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

	// Redirect to "/" if no profiles selected or formData is empty
	useEffect(() => {
		window.scrollTo(0, 0);

		const hasProfiles = Object.keys(formData).length > 0;
		if (!hasProfiles) {
			navigate("/");
		}
	}, [formData, navigate]);

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

	// Store the complete values in redux state after checking for required values
	const handleNext = () => {
		let isValid = true;

		Object.entries(formData).forEach(([_key, profiles]) => {
			profiles.forEach((profile) => {
				if (
					!profile.name.trim() ||
					!profile.dob.trim() ||
					!profile.gender.trim()
				) {
					isValid = false;
				}
			});
		});

		if (!isValid) {
			alert(
				"Please fill all required fields for each profile before continuing."
			);
			return;
		}

		Object.entries(formData).forEach(([key, profiles]) => {
			const type = key as ProfileType;
			profiles.forEach((data, index) => {
				dispatch(setPersonalData({ profileType: type, data, index }));
			});
		});

		navigate("/lifestyle");
	};

	// Previous button saves the form data in redux state using local state variable and populates Label in 1st page
	const handlePrev = () => {
		Object.entries(formData).forEach(([key, profiles]) => {
			const type = key as ProfileType;
			profiles.forEach((data, index) => {
				dispatch(setPersonalData({ profileType: type, data, index }));
			});
		});

		navigate("/");
	};

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
								className="flex items-center gap-4 my-10 p-4 border rounded-lg bg-slate-50 shadow"
							>
								<img
									src={iconMap[key as ProfileType]}
									alt={key}
									className="w-14 rounded-full object-cover"
								/>

								<div className="font-semibold capitalize w-28 px-1">
									{label}
								</div>

								<input
									type="text"
									placeholder="Name"
									value={profile.name}
									onChange={(e) =>
										handleChange(profileType, idx, "name", e.target.value)
									}
									className="border p-2 rounded flex-1 min-w-[140px]"
									required
								/>

								<input
									type="date"
									value={profile.dob}
									onChange={(e) =>
										handleChange(profileType, idx, "dob", e.target.value)
									}
									className="border p-2 rounded flex-1 min-w-[140px]"
								/>

								<select
									value={profile.gender}
									onChange={(e) =>
										handleChange(profileType, idx, "gender", e.target.value)
									}
									className="border p-2 rounded flex-1 min-w-[120px]"
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
									className="border p-2 rounded flex-1 min-w-[120px]"
								/>
							</div>
						);
					})}
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

export default NamesInput;
