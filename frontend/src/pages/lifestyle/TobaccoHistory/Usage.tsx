import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import type { RootState } from "../../../store";
import { resetAllState } from "../../../store/resetSlice";
import type { TobaccoUsage } from "../../../utils/interfaces";
import { setTobaccoHistory } from "../../../store/LifestyleSlice";
import SmallButton from "../../../components/shared/SmallButton";
import NewSharedOptions from "../../../components/shared/NewSharedOptions";

export default function Usage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const profileData = useSelector((s: RootState) => s.profiles.profileData);
	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
	const tobaccoHistory = useSelector(
		(s: RootState) => s.lifestyle.tobaccoHistory
	);
	const tobaccoHistoryData = tobaccoHistory.tobaccoHistoryData || {};

	useEffect(() => {
		const hasSelected = Object.values(profileData).some((p) => p.selected);
		if (!hasSelected) {
			dispatch(resetAllState());
			navigate("/");
		}
	}, [profileData, navigate, dispatch]);

	// Eligible and initialized profiles
	const profiles = useMemo(() => {
		if (!tobaccoHistory.hasHistory) return [];

		return Object.entries(personalInfo)
			.filter(([key]) => key in tobaccoHistoryData)
			.map(([profileName, data]) => ({
				profileName,
				data,
			}));
	}, [personalInfo, tobaccoHistory, tobaccoHistoryData]);

	const handleOptionSelect = (profileName: string, value: TobaccoUsage) => {
		dispatch(setTobaccoHistory({ profileType: profileName, frequency: value }));
	};

	const handlePrev = () => navigate("/lifestyle/habit-history-2");
	const handleNext = () => navigate("/medical-history");

	const allSelected = profiles.every(
		(p) => tobaccoHistoryData[p.profileName] !== null
	);

	const sanitizedSelectedValues = Object.fromEntries(
		Object.entries(tobaccoHistoryData).filter(
			([_, val]) => val !== null && val !== undefined
		)
	) as Record<string, TobaccoUsage>;

	return (
		<div className="max-w-3xl mx-auto py-12">
			<h2 className="text-2xl font-bold text-center mb-8">
				How often do they use tobacco?<br />
				<span className="text-xl font-semibold text-center mb-8">
					(like cigarettes, vaping, gutkha, etc.)
				</span>
			</h2>

			<NewSharedOptions<TobaccoUsage>
				profiles={profiles}
				options={["Under 5 units", "6 to 10 units", "Over 10 units"]}
				selectedValues={sanitizedSelectedValues}
				onOptionSelect={handleOptionSelect}
			/>

			<div className="mt-12 flex justify-center gap-8">
				<SmallButton variant="ghost" color="gray" onClick={handlePrev}>
					Previous
				</SmallButton>
				<SmallButton
					variant="solid"
					color="blue"
					onClick={handleNext}
					disabled={!allSelected}
				>
					Next
				</SmallButton>
			</div>
		</div>
	);
}
