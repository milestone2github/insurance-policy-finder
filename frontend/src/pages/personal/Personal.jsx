import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
	setPersonalData,
	syncPersonalDataWithSelection,
} from "../../store/PersonalSlice";
// import { PROFILE_LABELS, genderOptions, iconMap } from "../../utils/constants";
import { genderOptions, iconMap } from "../../utils/constants";
import SmallButton from "../../components/shared/SmallButton";
import { calculateAge } from "../../utils/calculateAge";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { sendDataToDb } from "../../utils/upsertDb";
import { useProgressValue } from "../../utils/ProgressContext";

const Personal = () => {
	const progressPercent = useProgressValue();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const profileData = useSelector(
		(state) => state.profiles.profileData
	);
	const personalInfo = useSelector(
		(state) => state.personal.personalInfo
	);

	const [formData, setFormData] = useState({});
	const [pincodeOverrides, setPincodeOverrides] = useState({});
	const [openKeys, setOpenKeys] = useState([]);

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
				{}
			);

			dispatch(syncPersonalDataWithSelection(selection));
		}
	}, [dispatch, profileData, navigate]);

	useEffect(() => {
		setFormData(personalInfo);
	}, [personalInfo]);

	const handlePincodeChange = (key, value) => {
		const formattedPincode = value.replace(/\D/g, "").slice(0, 6);

		setFormData((prev) => {
			const updated = {
				...prev,
				[key]: {
					...prev[key],
					pincode: formattedPincode,
				},
			};

			if (key === "myself") {
				// propagate to others unless they've overridden
				Object.entries(prev).forEach(([k, v]) => {
					if (k !== "myself" && !pincodeOverrides[k]) {
						updated[k] = {
							...v,
							pincode: formattedPincode,
						};
					}
				});
			} else {
				// manually overridden
				setPincodeOverrides((prev) => ({ ...prev, [key]: true }));
			}

			return updated;
		});
	};
	

	const handleChange = (
		key,
		field,
		value
	) => {
		// dob doesn't show dates less than 18 years in calendar
		if (field === "dob" && (key === "myself" || key === "spouse")) {
			const cutoffDate = new Date();
			cutoffDate.setFullYear(cutoffDate.getFullYear() - 18);
			const inputDate = new Date(value);

			if (inputDate > cutoffDate) {
				value = cutoffDate.toISOString().split("T")[0];
				toast.error("Age must be at least 18.");
			}
		}

		setFormData((prev) => ({
			...prev,
			[key]: {
				...prev[key],
				[field]: value,
			},
		}));
		toast.dismiss();
	};

	const getGenderOptions = (key) => {
		if (key.startsWith("son")) return genderOptions.son;
		if (key.startsWith("daughter")) return genderOptions.daughter;
		if (key.startsWith("grandfather")) return genderOptions.grandfather;
		if (key.startsWith("grandmother")) return genderOptions.grandmother;
		if (key.startsWith("fatherInLaw")) return genderOptions.fatherInLaw;
		if (key.startsWith("motherInLaw")) return genderOptions.motherInLaw;
		return (
			genderOptions[key] || ["male", "female"]
		);
	};

	const handleNext = async () => {
		let isValid = true;

		Object.entries(formData).forEach(([_, profile]) => {
			if (!profile.name || !profile.dob || !profile.gender || !profile.pincode) {
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
			toast.error("Your's or Spouse's age should be more than 18.");
			return;
		}

		Object.entries(formData).forEach(([profileKey, data]) => {
			dispatch(setPersonalData({ profileKey, data }));
		});

		await sendDataToDb(2, progressPercent);

		navigate("/lifestyle");
	};

	const handlePrev = () => {
		Object.entries(formData).forEach(([profileKey, data]) => {
			dispatch(setPersonalData({ profileKey, data }));
		});
		navigate("/");
	};

	return (
		// <div className="flex flex-col max-w-5xl mx-auto h-[calc(100vh-4rem)] p-6">
		<div className="flex flex-col md:min-w-4/5 lg:w-fit mx-auto h-fit min-h-1/2 p-6">
			<div className="flex justify-center text-2xl font-semibold text-gray-900 mb-6">
				<h2 className="">
					Let's get to know your family{" "}
					<span className="text-[#0B1761]">better</span>
				</h2>
			</div>

			<div className="flex-1 overflow-hidden">
				<div className="bg-white rounded-lg shadow-sm h-[calc(100%-1rem)] overflow-y-auto p-6 space-y-6 border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
					{Object.entries(formData).map(([key, data], index) => {
						// const isOpen = openKeys.includes(key);
						const isOpen = openKeys.includes(key) || index === 0;
						const toggleOpen = () => {
							setOpenKeys(
								(prev) =>
									prev.includes(key)
										? prev.filter((k) => k !== key) // close
										: [...prev, key] // open
							);
						};

						return (
							<div key={key}>
								{/* Small screens: collapsible view */}
								<div className="block xl:hidden border border-gray-200 rounded-lg overflow-hidden mb-4">
									<div
										className="flex items-center justify-between p-4 bg-white cursor-pointer"
										onClick={toggleOpen}
									>
										<div className="flex items-center gap-3">
											<img
												src={iconMap[key.split("-")[0]]}
												alt={key}
												className="w-10 rounded-full object-cover"
											/>
											<div className="font-medium capitalize text-gray-800 text-sm">
												{key.replace(/-/g, " ")}
											</div>
										</div>
										<span className="text-lg text-gray-500">
											{/* {isOpen ? "⮝" : "⮟"} */}
											{isOpen ? <FaChevronUp /> : <FaChevronDown />}
										</span>
									</div>

									{isOpen && (
										<div className="bg-white px-4 pb-4 grid gap-4 lg:grid-cols-2">
											{/* Same inputs as before */}
											{/** Full Name */}
											<div className="flex flex-col">
												<label className="text-xs text-gray-500 mb-1">
													Full Name *
												</label>
												<input
													type="text"
													value={data.name || ""}
													onChange={(e) =>
														handleChange(key, "name", e.target.value)
													}
													className="border border-gray-400 rounded p-2 w-full text-sm"
												/>
											</div>

											{/** DOB */}
											<div className="flex flex-col">
												<label className="text-xs text-gray-500 mb-1">
													DOB *
												</label>
												<input
													type="date"
													value={data.dob || ""}
													onChange={(e) =>
														handleChange(key, "dob", e.target.value)
													}
													max={new Date().toISOString().split("T")[0]}
													className="border border-gray-400 rounded p-2 w-full text-sm"
												/>
											</div>

											{/** Gender */}
											<div className="flex flex-col">
												<label className="text-xs text-gray-500 mb-1">
													Gender *
												</label>
												<select
													value={data.gender}
													onChange={(e) =>
														handleChange(key, "gender", e.target.value)
													}
													className="border border-gray-400 rounded p-2 w-full text-sm"
												>
													{getGenderOptions(key).map((g) => (
														<option key={g} value={g}>
															{g.charAt(0).toUpperCase() + g.slice(1)}
														</option>
													))}
												</select>
											</div>

											{/** Pincode */}
											<div className="flex flex-col">
												<label className="text-xs text-gray-500 mb-1">
													Pincode *
												</label>
												<input
													type="text"
													value={data.pincode || ""}
													onChange={(e) => handlePincodeChange(key, e.target.value) }
													className="border border-gray-400 rounded p-2 w-full text-sm"
													maxLength={6}
												/>
											</div>
										</div>
									)}
								</div>

								{/* Medium+ screens: original horizontal layout */}
								<div className="hidden xl:flex items-center gap-3 mb-6">
									<img
										src={iconMap[key.split("-")[0]]}
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
											onChange={(e) => handleChange(key, "name", e.target.value) }
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
											// max={new Date().toISOString().split("T")[0]}
											max={
												key === "myself" || key === "spouse"
													? new Date(
															new Date().setFullYear(
																new Date().getFullYear() - 18
															)
													  )
															.toISOString()
															.split("T")[0]
													: undefined
											}
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
											Pincode *
										</label>
										<input
											type="text"
											value={data.pincode || ""}
											onChange={(e) => handlePincodeChange(key, e.target.value) }
												// handleChange(
												// 	key,
												// 	"pincode",
												// 	e.target.value.replace(/\D/g, "").slice(0, 6)
												// )
											// }
											className="border border-gray-400 rounded p-1.5 pt-3 w-full text-md"
											maxLength={6}
										/>
									</div>
								</div>

								{index !== Object.entries(formData).length - 1 && (
									<div className="border-t mt-6 border-gray-200 hidden xl:block" />
								)}
							</div>
						);
					})}
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
