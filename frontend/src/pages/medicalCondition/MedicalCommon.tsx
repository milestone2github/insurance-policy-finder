import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import SmallButton from "../../components/shared/SmallButton";
import { calculateAge } from "../../utils/calculateAge";
import diseases from "../../assets/diseaseList.json";
import { iconMap } from "../../utils/constants";
import Select from "react-select";
import toast from "react-hot-toast";
import { setMedicalData } from "../../store/MedicalConditionSlice";

export default function MedicalCommon() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
	const medicalInfo = useSelector((s: RootState) => s.medicalCondition);
	
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
			.filter(Boolean) as { profileKey: string; data: any }[];
	}, [selectedProfiles, personalInfo]);

	const sortedDiseases = useMemo(() => {
		return [...diseases].sort((a, b) =>
			a.illness_name.localeCompare(b.illness_name)
		);
	}, []);

	const handleIllnessChange = (
		profileKey: string,
		selectedOptions: string[]
	) => {
		dispatch(
			setMedicalData({
				profileKey,
				data: { selectedIllnesses: selectedOptions },
			})
		);
	};

	const handleOtherIllnessChange = (profileKey: string, value: string) => {
		dispatch(setMedicalData({ profileKey, data: { otherIllness: value } }));
	};

	const handleHospitalisationYearChange = (profileKey: string, value: string) => {
		dispatch(setMedicalData({ profileKey, data: { hospitalisationYear: value } }));
	};

	const handleClearFields = (profileKey: string) => {
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
	const handleNext = () => {
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
		navigate("/policies");
	};

	return (
		<div className="max-w-3xl mx-auto py-12 space-y-8">
			<h2 className="text-2xl font-bold text-center mb-8">
				{activeQuestion === "hospitalisation" &&
					"Has anyone been hospitalized in the past with any illness?"}
				{activeQuestion === "medicalTest" &&
					"Have any of these members undergone medical tests?"}
				{activeQuestion === "medicalHistory" &&
					"Select Medical Conditions for Each Member"}
			</h2>

			{profiles.map(({ profileKey, data }) => {
				const baseType = profileKey.split("-")[0] as keyof typeof iconMap;
				const iconSrc = iconMap[baseType];
				const age = calculateAge(data?.dob);
				const selectedIllnesses =
					medicalData?.[profileKey]?.selectedIllnesses || [];
				const otherIllness = medicalData?.[profileKey]?.otherIllness || "";
				const hospitalisationYear = medicalData?.[profileKey]?.hospitalisationYear || "";

				return (
					<div
						key={profileKey}
						className="flex flex-col gap-4 p-4 border rounded-lg bg-white shadow"
					>
						<div className="flex items-center gap-4">
							<img
								src={iconSrc}
								alt={baseType}
								className="w-14 h-14 rounded-full object-cover"
							/>
							<div className="min-w-[160px] font-semibold capitalize">
								{data?.name}
								<span className="text-sm text-gray-500"> ({age} yrs.)</span>
							</div>

							<div className="flex-1">
								<Select
									isMulti
									options={sortedDiseases.map((d) => ({
										label: d.illness_name,
										value: d.illness_name,
									}))}
									value={selectedIllnesses.map((illness) => ({
										label: illness,
										value: illness,
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

							<SmallButton
								variant="ghost"
								color="darkblue"
								onClick={() => handleClearFields(profileKey)}
							>
								Clear Fields
							</SmallButton>
						</div>

						{/* Other illness input and (conditional) hospitalisation year */}
						<div className="flex gap-4 items-end">
							<input
								type="text"
								value={otherIllness}
								onChange={(e) =>
									handleOtherIllnessChange(profileKey, e.target.value)
								}
								placeholder="Other illness (if any)"
								className="flex-1 p-2 border border-gray-400 rounded"
							/>
							{activeQuestion === "hospitalisation" && (
								<input
									type="text"
									value={hospitalisationYear}
									onChange={(e) =>
										handleHospitalisationYearChange(profileKey, e.target.value)
									}
									placeholder="Hospitalisation Year"
									maxLength={4}
									className="flex-1 p-2 border border-gray-400 rounded"
									required
								/>
							)}
						</div>
					</div>
				);
			})}

			<div className="flex justify-center gap-8 mt-8">
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
