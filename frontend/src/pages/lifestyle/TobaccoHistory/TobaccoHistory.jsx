import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	resetTobaccoHistory,
	setTobaccoHistory,
	setHasHistory,
} from "../../../store/LifestyleSlice";
import ProfileSelection from "../../../components/shared/ProfileSelection";
import LargeButton from "../../../components/shared/LargeButton";
import SmallButton from "../../../components/shared/SmallButton";
import { calculateAge } from "../../../utils/calculateAge";
import { resetAllState } from "../../../store/resetSlice";
import toast from "react-hot-toast";

export default function TobaccoHistory() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const profileData = useSelector((s) => s.profiles.profileData);
	const personalInfo = useSelector((s) => s.personal.personalInfo);
	const lifestyleData = useSelector(
		(s) => s.lifestyle.lifestyleData
	);
	const tobaccoData = useSelector((s) => s.lifestyle.tobaccoHistory);

	const hasHistory = tobaccoData.hasHistory ?? null;
	const tobaccoHistoryData = tobaccoData.tobaccoHistoryData || {};

	useEffect(() => {
		const hasSelected = Object.values(profileData).some((p) => p.selected);
		if (!hasSelected) {
			dispatch(resetAllState());
			navigate("/");
			return;
		}
	}, [lifestyleData, profileData, navigate]);

	const eligibleProfiles = useMemo(() => {
		const result = Object.entries(personalInfo)
			.flatMap(([profileType, data]) => {
				const age = calculateAge(data.dob);
				if (age < 18) return null;

				return {
					profileType: profileType,
					label: data.name,
					age,
				};
			})
			.filter(Boolean);

		return result;
	}, [personalInfo]);

	const toggleMember = (profileType) => {
		if (!hasHistory) return;

		const isSelected = profileType in tobaccoHistoryData;

		if (isSelected) {
			dispatch(resetTobaccoHistory(profileType));
		} else {
			dispatch(setTobaccoHistory({ profileType }));
		}
	};

	const handleNext = () => {
		if (hasHistory === false) {
			dispatch(setHasHistory({ substance: "tobacco", hasHistory: false }));
			navigate("/medical-history");
		}

		if (hasHistory === true) {
			if (Object.keys(tobaccoHistoryData).length > 0) {
				navigate("/lifestyle/habit-history-2/usage");
			} else {
				toast.error("Please select atleast one profile.");
			}
		}
	};

	const handlePrev = () => {
		if (hasHistory === false) {
			dispatch(setHasHistory({ substance: "tobacco", hasHistory: false }));
		}
		navigate("/lifestyle/habit-history-1");	// Back moves to AlcoholHistory selection
	};

	return (
		// <div className="w-3/4 2xl:w-1/2 mx-auto py-12 px-4 2xl:h-1/2">
		<div className="flex flex-col w-fit sm:w-3/4 2xl:w-1/2 mx-auto py-12 px-4">
			<h2 className="text-2xl font-semibold text-center mb-8">
				Does anyone in your family use{" "}
				<span className="text-[#0B1761]">tobacco</span> products or smoke?
			</h2>

			<div className="flex justify-center gap-6 mb-10 px-2 flex-nowrap">
				<LargeButton
					label="Yes"
					selected={hasHistory === true}
					onClick={() =>
						dispatch(setHasHistory({ substance: "tobacco", hasHistory: true }))
					}
				/>
				<LargeButton
					label="No"
					selected={hasHistory === false}
					onClick={() =>
						dispatch(setHasHistory({ substance: "tobacco", hasHistory: false }))
					}
				/>
			</div>

			{hasHistory && (
				<>
					<p className="text-center mb-4 font-semibold">
						Select family members who consume tobacco
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto px-2">
						{eligibleProfiles.map(({ profileType, label, age }) => (
							<ProfileSelection
								key={profileType}
								profileType={profileType}
								label={`${label} (${age} yrs)`}
								selected={tobaccoHistoryData.hasOwnProperty(profileType)}
								onSelect={() => toggleMember(profileType)}
								onCountChange={undefined}
								selectMode={true}
							/>
						))}
					</div>
				</>
			)}

			<div className="border-t border-gray-200 mt-4 2xl:mt-12 pt-4">
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
	
}
