import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useMedicalQuestion } from "../../hooks/useMedicalQuestion";
import { calculateAge } from "../../utils/calculateAge";
import ProfileButton from "../../components/shared/ProfileButton";
import LargeButton from "../../components/shared/LargeButton";
import SmallButton from "../../components/shared/SmallButton";
import type { RootState } from "../../store";
import type { ProfileType } from "../../utils/interfaces";
import { useNavigate } from "react-router";

export default function MedicalTestHistory() {
	const navigate = useNavigate();
	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
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
			profileType: profileType as ProfileType,
			label: data.name,
			age: calculateAge(data.dob),
		}));
	}, [personalInfo]);

	return (
		<div className="max-w-2xl mx-auto py-12">
			<h2 className="text-2xl font-bold text-center mb-8">
				Were there any adverse finding(s) in medical tests conducted in the last
				year?
			</h2>

			<div className="flex justify-center space-x-6 mb-8">
				<LargeButton
					label="Yes"
					selected={activeQuestion === "medicalTest"}
					onClick={handleYes}
				/>
				<LargeButton
					label="No"
					selected={activeQuestion === null}
					onClick={handleNo}
				/>
			</div>

			{activeQuestion === "medicalTest" && (
				<>
					<p className="text-center mb-4 font-medium">
						Select family members with medical history:
					</p>
					<div className="flex flex-wrap justify-center">
						{eligibleProfiles.map(({ profileType, label, age }) => (
							<ProfileButton
								key={profileType}
								profileType={profileType}
								label={`${label} (${age} yrs)`}
								selected={selectedProfiles.includes(profileType)}
								onSelect={() => toggleProfile(profileType)}
								onCountChange={undefined}
								selectMode
							/>
						))}
					</div>
				</>
			)}

			<div className="mt-12 flex justify-center gap-8">
				<SmallButton variant="ghost" color="gray" onClick={handlePrevious}>
					Previous
				</SmallButton>
				<SmallButton
					variant="solid"
					color="blue"
					onClick={handleNext}
					// disabled={
					// 	activeQuestion === "medicalTest" && selectedProfiles.length === 0
					// }
				>
					Next
				</SmallButton>
			</div>
		</div>
	);
}
