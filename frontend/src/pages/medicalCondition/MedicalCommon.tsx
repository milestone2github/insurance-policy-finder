import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
// import { setMedicalData } from "../../store/medicalConditionSlice";
import SmallButton from "../../components/shared/SmallButton";
import { calculateAge } from "../../utils/calculateAge";
import diseases from "../../assets/diseaseList.json";
import { setMedicalData } from "../../store/MedicalConditionSlice";
import { iconMap } from "../../utils/constants";
import Select from "react-select";

export default function MedicalCommon() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Redux selectors
	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
	const selectedProfiles = useSelector((s: RootState) => s.medicalCondition.selectedProfiles);
	const medicalData = useSelector((s: RootState) => s.medicalCondition.medicalData);
	const activeQuestion = useSelector((state: RootState) => state.medicalCondition.activeQuestion);

	// Redirect if no selection
	useEffect(() => {
		if (!selectedProfiles.length) {
			navigate("/");
		}
	}, [selectedProfiles, navigate]);

	// Prepare selected profiles with data from personalInfo
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
		dispatch(setMedicalData({ profileKey, data: selectedOptions }));
	};

	const handleClearFields = (profileKey: string) => {
		dispatch(setMedicalData({ profileKey, data: [] }));
	};

	// const handlePrev = () => navigate("/medical/hospitalisation");
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
				prevPath = "/"; // fallback
		}

		navigate(prevPath);
	};
	const handleNext = () => navigate("/policies");

	return (
		<div className="max-w-3xl mx-auto py-12 space-y-8">
			<h2 className="text-2xl font-bold text-center mb-8">
				Select Medical Conditions for Each Member
			</h2>

			{profiles.map(({ profileKey, data }) => {
				const baseType = profileKey.split("-")[0] as keyof typeof iconMap;
				const iconSrc = iconMap[baseType];
				const age = calculateAge(data?.dob);
				// const selectedIllnesses = medicalData[profileKey] || [];
				const selectedIllnesses = medicalData?.[profileKey] || [];

				return (
					<div
						key={profileKey}
						className="flex flex-col gap-2 p-4 border rounded-lg bg-slate-50 shadow"
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

							{/* Multi-select dropdown */}
							{/* <div className="relative flex-1">
								<select
									multiple
									value={selectedIllnesses}
									onChange={(e) => {
										const options = Array.from(
											e.target.selectedOptions,
											(option) => option.value
										);
										handleIllnessChange(profileKey, options);
									}}
									className="w-full rounded border border-gray-300 p-2 cursor-pointer"
								>
									{sortedDiseases.map(({ illness_name, slug }) => (
										<option key={slug} value={illness_name}>
											{illness_name}
										</option>
									))}
								</select>
							</div> */}

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
								color="blue"
								onClick={() => handleClearFields(profileKey)}
							>
								Clear Fields
							</SmallButton>
						</div>
					</div>
				);
			})}

			<div className="flex justify-center gap-8 mt-8">
				<SmallButton variant="ghost" color="gray" onClick={handlePrev}>
					Previous
				</SmallButton>
				<SmallButton variant="solid" color="blue" onClick={handleNext}>
					Next
				</SmallButton>
			</div>
		</div>
	);
}
