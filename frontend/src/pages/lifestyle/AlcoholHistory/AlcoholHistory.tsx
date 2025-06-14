import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../store";
import type { ProfileType } from "../../../utils/interfaces";
import {
	resetAlcoholHistory,
	setAlcoholHistory,
	setHasHistory,
} from "../../../store/LifestyleSlice";
import ProfileSelection from "../../../components/shared/ProfileSelection";
import LargeButton from "../../../components/shared/LargeButton";
import SmallButton from "../../../components/shared/SmallButton";
import { calculateAge } from "../../../utils/calculateAge";
import { resetAllState } from "../../../store/resetSlice";
import toast from "react-hot-toast";

export default function AlcoholHistory() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const profileData = useSelector((s: RootState) => s.profiles.profileData);
	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
	const lifestyleData = useSelector((s: RootState) => s.lifestyle.lifestyleData);
	const alcoholData = useSelector((s: RootState) => s.lifestyle.alcoholHistory);

	const hasHistory = alcoholData.hasHistory ?? null;
	const alcoholHistoryData = alcoholData.alcoholHistoryData || {};

	useEffect(() => {
		const hasSelected = Object.values(profileData).some((p) => p.selected);
		if (!hasSelected) {
			dispatch(resetAllState());
			navigate("/");
		}
	}, [lifestyleData, profileData, navigate, dispatch]);

	const eligibleProfiles = useMemo(() => {
		return Object.entries(personalInfo)
			.flatMap(([profileType, data]) => {
				const age = calculateAge(data.dob);
				if (age < 18) return null;
				return {
					profileType: profileType as ProfileType,
					label: data.name,
					age,
				};
			})
			.filter(Boolean) as {
			profileType: ProfileType;
			label: string;
			age: number;
		}[];
	}, [personalInfo]);

	const toggleMember = (profileType: string) => {
		if (!hasHistory) return;
		const isSelected = profileType in alcoholHistoryData;
		if (isSelected) {
			dispatch(resetAlcoholHistory(profileType));
			toast.dismiss();
			// console.log("History data after removing entry: ---> ", alcoholData); // debug: data storing 1-step delayed in redux state
		} else {
			dispatch(setAlcoholHistory({ profileType }));
			// console.log("History data stored in state as: ---> ", alcoholData);
		}
	};
	
	const handleNext = () => {
		if (hasHistory === false) {
			dispatch(setHasHistory({ substance: "alcohol", hasHistory: false }));
			navigate("/lifestyle/habit-history-2");
			return;
		}
		if (hasHistory === true) {
			if (Object.keys(alcoholHistoryData).length > 0) {
				navigate("/lifestyle/habit-history-1/frequency");
			} else {
				toast.error("Please select atleast one profile.");
			}
		}
	};

	const handlePrev = () => {
		if (hasHistory === false) {
			dispatch(setHasHistory({ substance: "alcohol", hasHistory: false }));
		}
		navigate("/lifestyle");
	};

	return (
		<div className="max-w-2xl mx-auto py-12 px-4">
			<h2 className="text-2xl font-semibold text-center mb-8">
				Does anyone in your family consume {" "}
				<span className="text-[#0B1761]">alcohol</span>?
			</h2>

			<div className="flex justify-center space-x-6 mb-8 flex-wrap">
				<LargeButton
					label="Yes"
					selected={hasHistory === true}
					onClick={() =>
						dispatch(setHasHistory({ substance: "alcohol", hasHistory: true }))
					}
				/>
				<LargeButton
					label="No"
					selected={hasHistory === false}
					onClick={() =>
						dispatch(setHasHistory({ substance: "alcohol", hasHistory: false }))
					}
				/>
			</div>

			{hasHistory && (
				<>
					<p className="text-center mb-4 font-semibold">
						Select family members who consume alcohol
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[230px] px-2">
						{eligibleProfiles.map(({ profileType, label, age }) => (
							<ProfileSelection
								key={profileType}
								profileType={profileType}
								label={`${label} (${age} yrs)`}
								selected={alcoholHistoryData.hasOwnProperty(profileType)}
								onSelect={() => toggleMember(profileType)}
								onCountChange={undefined}
								selectMode={true}
							/>
						))}
					</div>
				</>
			)}

			<div className="border-t border-gray-200 mt-4 pt-4">
				<div className="flex justify-center gap-5 flex-wrap">
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
