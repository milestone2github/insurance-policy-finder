import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useMedicalQuestion } from "../../hooks/useMedicalQuestion";
import { calculateAge } from "../../utils/calculateAge";
import LargeButton from "../../components/shared/LargeButton";
import SmallButton from "../../components/shared/SmallButton";
import type { RootState } from "../../store";
import type { ProfileType } from "../../utils/interfaces";
import { useNavigate } from "react-router";
import ProfileSelection from "../../components/shared/ProfileSelection";

export default function MedicalHistory() {
	const navigate = useNavigate();
	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
	const {
		activeQuestion,
		selectedProfiles,
		handleYes,
		handleNo,
		handleNext,
		handlePrevious,
		toggleProfile,
	} = useMedicalQuestion(
		"medicalHistory",
		"/medical/test-history",
		"/lifestyle/habit-history-2"
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
		<div className="max-w-2xl mx-auto py-12 px-4">
			<h2 className="text-2xl font-semibold text-center mb-8">
				Have you or any family member(s) been diagnosed with any{" "}
				<span className="text-[#0B1761]">medical conditions</span> other than common cold or fever?
			</h2>

			<div className="flex justify-center space-x-6 mb-8 flex-wrap">
				<LargeButton
					label="Yes"
					selected={activeQuestion === "medicalHistory"}
					onClick={handleYes}
				/>
				<LargeButton
					label="No"
					selected={
						activeQuestion === null || activeQuestion !== "medicalHistory"
					}
					onClick={handleNo}
				/>
			</div>

			{activeQuestion === "medicalHistory" && (
				<>
					<p className="text-center mb-4 font-semibold">
						Select family members with medical history
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[230px] px-2">
						{eligibleProfiles.map(({ profileType, label, age }) => (
							<ProfileSelection
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

			<div className="border-t border-gray-200 mt-4 pt-4">
				<div className="flex justify-center gap-5 flex-wrap">
					<SmallButton variant="ghost" color="gray" onClick={handlePrevious}>
						Previous
					</SmallButton>
					<SmallButton variant="solid" color="darkblue" onClick={handleNext}>
						Next
					</SmallButton>
				</div>
			</div>
		</div>
	);	
}
