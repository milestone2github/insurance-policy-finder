import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useMedicalQuestion } from "../../hooks/useMedicalQuestion";
import { calculateAge } from "../../utils/calculateAge";
import ProfileSelection from "../../components/shared/ProfileSelection";
import LargeButton from "../../components/shared/LargeButton";
import SmallButton from "../../components/shared/SmallButton";
import { useNavigate } from "react-router";

export default function MedicalTestHistory() {
	const navigate = useNavigate();
	const personalInfo = useSelector((s) => s.personal.personalInfo);
	// inside MedicalTestHistory.tsx
	const {
		activeQuestion,
		selectedProfiles,
		handleYes,
		handleNo,
		handleNext,
		handlePrevious,
		toggleProfile,
	} = useMedicalQuestion(
		"medicalTest",
		"/medical/hospitalisation",
		"/medical-history"
	);

	// Redirect to / if no profiles selected
	useEffect(() => {
		if (!personalInfo || Object.keys(personalInfo).length === 0) {
			navigate("/");
		}
	}, [personalInfo, navigate]);

	const eligibleProfiles = useMemo(() => {
		return Object.entries(personalInfo).map(([profileType, data]) => ({
			profileType: profileType,
			label: data.name,
			age: calculateAge(data.dob),
		}));
	}, [personalInfo]);

	return (
		// <div className="max-w-2xl mx-auto py-12 px-4">
		<div className="flex flex-col w-fit sm:w-3/4 2xl:w-1/2 mx-auto py-12 px-4">
			<h2 className="text-2xl font-semibold text-center mb-8">
				Were there any adverse findings in{" "}
				<span className="text-[#0B1761]">medical tests</span> conducted in the
				last year?
			</h2>

			<div className="flex justify-center gap-6 mb-10 flex-nowrap">
				<LargeButton
					label="Yes"
					selected={activeQuestion === "medicalTest"}
					onClick={handleYes}
				/>
				<LargeButton
					label="No"
					selected={activeQuestion === null || activeQuestion !== "medicalTest"}
					onClick={handleNo}
				/>
			</div>

			{activeQuestion === "medicalTest" && (
				<>
					<p className="text-center mb-4 font-semibold">
						Select family members with medical history
					</p>
					{/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[230px] px-2"> */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto px-2">
						{eligibleProfiles.map(({ profileType, label, age }) => (
							<ProfileSelection
								key={profileType}
								profileType={profileType}
								label={`${label} (${age} yrs)`}
								selected={selectedProfiles.includes(profileType)}
								onSelect={() => toggleProfile(profileType)}
								onCountChange={undefined}
								selectMode={true}
							/>
						))}
					</div>
				</>
			)}

			<div className="border-t border-gray-200 mt-4 2xl:mt-12 pt-4">
				<div className="flex justify-center gap-5">
					<SmallButton onClick={handlePrevious} variant="ghost" color="gray">
						Previous
					</SmallButton>
					<SmallButton onClick={handleNext} color="darkblue">
						Next
					</SmallButton>
				</div>
			</div>
		</div>
	);
	
}
