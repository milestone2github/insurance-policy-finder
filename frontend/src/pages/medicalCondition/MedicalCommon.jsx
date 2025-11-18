import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SmallButton from "../../components/shared/SmallButton";
import { calculateAge } from "../../utils/calculateAge";
import diseases from "../../assets/diseaseList.json";
import { iconMap } from "../../utils/constants";
import Select from "react-select";
import toast from "react-hot-toast";
import { setMedicalData } from "../../store/MedicalConditionSlice";
import { sendDataToDb } from "../../utils/upsertDb";
import { useProgressValue } from "../../utils/ProgressContext";

export default function MedicalCommon() {
	const progressPercent = useProgressValue();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const personalInfo = useSelector((s) => s.personal.personalInfo);
	const medicalInfo = useSelector((s) => s.medicalCondition);
	
	const selectedProfiles = medicalInfo.selectedProfiles;
	const medicalData = medicalInfo.medicalData;
	const activeQuestion = medicalInfo.activeQuestion;

	useEffect(() => {
		if (!selectedProfiles.length) {
			navigate("/");
		}
	}, [selectedProfiles, navigate]);

	const profiles = useMemo(() => {
		return selectedProfiles
			.map((key) => {
				const data = personalInfo[key];
				if (!data) return null;
				return { profileKey: key, data };
			})
			.filter(Boolean);
	}, [selectedProfiles, personalInfo]);

	const sortedDiseases = useMemo(() => {
		return [...diseases].sort((a, b) =>
			a.illness_name.localeCompare(b.illness_name)
		);
	}, []);

	const handleIllnessChange = (
		profileKey,
		selectedOptions
	) => {
		dispatch(
			setMedicalData({
				profileKey,
				data: { selectedIllnesses: selectedOptions },
			})
		);
	};

	const handleOtherIllnessChange = (profileKey, value) => {
		dispatch(setMedicalData({ profileKey, data: { otherIllness: value } }));
	};

	const handleHospitalisationYearChange = (profileKey, value) => {
		dispatch(setMedicalData({ profileKey, data: { hospitalisationYear: value } }));
	};

	const handleClearFields = (profileKey) => {
		dispatch(
			setMedicalData({
				profileKey,
				data: {
					selectedIllnesses: [],
					otherIllness: "",
					hospitalisationYear: "",
					// hospitalisationPeriod: { from: "", to: "" },
				},
			})
		);
	};

	const handlePrev = () => {
		let prevPath = "/";
		switch (activeQuestion) {
			case "hospitalisation":
				prevPath = "/medical/hospitalisation";
				break;
			case "medicalTest":
				prevPath = "/medical/test-history";
				break;
			case "medicalHistory":
				prevPath = "/medical-history";
				break;
			default:
				prevPath = "/";
		}
		navigate(prevPath);
	};

	/******* TO IMPROVE: Add logic to RESET the hospitalisation year if other page is selected. *******/
	const handleNext = async () => {
		let hasEmptyField = false;
		for (const profileKey of selectedProfiles) {
			const selectedIllnesses = medicalData?.[profileKey]?.selectedIllnesses;
			const otherIllness = medicalData?.[profileKey]?.otherIllness;
			const hospitalisationYear = medicalData?.[profileKey]?.hospitalisationYear;

			// if ((selectedIllnesses?.length === 0 && !otherIllness) || !hospitalisationYear) {
				if (
					(!selectedIllnesses?.length && !otherIllness) || 
					(activeQuestion === 'hospitalisation' && !hospitalisationYear)
				) {
					hasEmptyField = true;
					break;
				}
		}
		if (hasEmptyField) {
			toast.error("Please fill all details for each profile.");
			return;
		}

		await sendDataToDb(3, progressPercent);

		navigate("/policies");
	};

	return (
		// <div className="max-w-3xl mx-auto py-8 space-y-6 px-4 xl:px-0">
		<div className="flex flex-col mx-auto md:min-w-3/4 lg:w-fit min-h-1/2 max-h-4/5 p-6">
			<h2 className="text-2xl font-semibold text-center">
				{activeQuestion === "hospitalisation" &&
					"Has anyone been hospitalized in the past with any illness?"}
				{activeQuestion === "medicalTest" &&
					"Have any of these members undergone medical tests?"}
				{activeQuestion === "medicalHistory" &&
					"Indicate any medical conditions that have been diagnosed in your family."}
			</h2>
			<p className="text-center text-sm font-medium text-gray-600 mb-10">
				Please choose medical condition(s) thoughtfully, as they will directly
				affect the recommendations you receive.
			</p>

			{profiles.map(({ profileKey, data }) => {
				const baseType = profileKey.split("-")[0];
				const iconSrc = iconMap[baseType];
				const age = calculateAge(data?.dob);
				const selectedIllnesses =
					medicalData?.[profileKey]?.selectedIllnesses || [];
				const otherIllness = medicalData?.[profileKey]?.otherIllness || "";
				const hospitalisationYear =
					medicalData?.[profileKey]?.hospitalisationYear || "";

				return (
					<div key={profileKey} className="px-2 xl:px-0">
						<div className="border border-gray-200 rounded-lg bg-white p-4 shadow-sm space-y-4">
							<div className="flex flex-wrap items-center gap-4">
								<img
									src={iconSrc}
									alt={baseType}
									className="w-12 h-12 rounded-full object-cover"
								/>
								<div className="font-semibold capitalize">
									{data?.name}
									<span className="text-sm text-gray-500 ml-2">
										({age} yrs)
									</span>
								</div>

								<div className="flex-1 min-w-[200px]">
									<Select
										isMulti
										options={sortedDiseases.map((d) => ({
											label: d.illness_name,
											value: d.illness_name,
										}))}
										value={selectedIllnesses.map((i) => ({
											label: i,
											value: i,
										}))}
										onChange={(selected) =>
											handleIllnessChange(
												profileKey,
												selected.map((opt) => opt.value)
											)
										}
										className="w-full"
									/>
								</div>
								{/* 
								<SmallButton
									variant="ghost"
									color="red"
									onClick={() => handleClearFields(profileKey)}
								>
									Clear All
								</SmallButton> */}
								<div className="hidden lg:block">
									<SmallButton
										variant="ghost"
										color="red"
										onClick={() => handleClearFields(profileKey)}
									>
										Clear All
									</SmallButton>
								</div>
							</div>

							<div className="flex flex-wrap gap-4">
								<input
									type="text"
									value={otherIllness}
									onChange={(e) =>
										handleOtherIllnessChange(profileKey, e.target.value)
									}
									placeholder="Others? Please Specify"
									className="flex-grow min-w-[200px] p-2 border border-gray-300 rounded"
								/>

								{activeQuestion === "hospitalisation" && (
									<input
										type="text"
										value={hospitalisationYear}
										onChange={(e) =>
											handleHospitalisationYearChange(
												profileKey,
												e.target.value
											)
										}
										placeholder="Hospitalisation Year"
										maxLength={4}
										className="flex-1 min-w-[160px] p-2 border border-gray-300 rounded"
										required
									/>
								)}

								{/* Clear All Button for <lg screens */}
								<div className="lg:hidden">
									<SmallButton
										variant="ghost"
										color="red"
										onClick={() => handleClearFields(profileKey)}
										className="w-full sm:w-auto px-4"
									>
										Clear All
									</SmallButton>
								</div>
							</div>
						</div>
					</div>
				);
			})}

			<div className="flex justify-center gap-4 pt-6">
				<SmallButton variant="ghost" color="gray" onClick={handlePrev}>
					Previous
				</SmallButton>
				<SmallButton variant="solid" color="darkblue" onClick={handleNext}>
					Next
				</SmallButton>
			</div>
		</div>
	);	
}
