import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import type { RootState } from "../../../store";
import { resetAllState } from "../../../store/resetSlice";
import type { AlcoholFrequency } from "../../../utils/interfaces";
import { setAlcoholHistory } from "../../../store/LifestyleSlice";
import SmallButton from "../../../components/shared/SmallButton";
import NewSharedOptions from "../../../components/shared/NewSharedOptions";

export default function Frequency() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const profileData = useSelector((s: RootState) => s.profiles.profileData);
	const personalInfo = useSelector((s: RootState) => s.personal.personalInfo);
	const alcoholHistory = useSelector((s: RootState) => s.lifestyle.alcoholHistory);
	const alcoholHistoryData = alcoholHistory.alcoholHistoryData || {};

	useEffect(() => {
		const hasSelected = Object.values(profileData).some((p) => p.selected);
		if (!hasSelected) {
			dispatch(resetAllState());
			navigate("/");
		}
	}, [profileData, navigate, dispatch]);

	// Eligible and initialized profiles
	const profiles = useMemo(() => {
		if (!alcoholHistory.hasHistory) return [];

		return Object.entries(personalInfo)
			.filter(([key]) => key in alcoholHistoryData)
			.map(([profileName, data]) => ({
				profileName,
				data,
			}));
	}, [personalInfo, alcoholHistory, alcoholHistoryData]);
	

	const handleOptionSelect = (profileName: string, value: AlcoholFrequency) => {
		dispatch(setAlcoholHistory({ profileType: profileName, frequency: value }));
	};

	const handlePrev = () => navigate("/lifestyle/habit-history-1");
	const handleNext = () => navigate("/lifestyle/habit-history-2");

	const allSelected = profiles.every((p) => alcoholHistoryData[p.profileName] !== null);

	const sanitizedSelectedValues = Object.fromEntries(
		Object.entries(alcoholHistoryData).filter(
			([_, val]) => val !== null && val !== undefined
		)
	) as Record<string, AlcoholFrequency>;

	return (
		<div className="max-w-3xl mx-auto py-12">
			<h2 className="text-2xl font-bold text-center mb-8">
				How often do they consume alcohol?
			</h2>

			<NewSharedOptions<AlcoholFrequency>
				profiles={profiles}
				options={["Daily", "Weekly", "Occasionally", "Rarely"]}
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
