import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import type { RootState } from "../../../store";
import { resetAllState } from "../../../store/resetSlice";
import type { TobaccoUsage } from "../../../utils/interfaces";
import { setTobaccoHistory } from "../../../store/LifestyleSlice";
import SmallButton from "../../../components/shared/SmallButton";
import NewSharedOptions from "../../../components/shared/NewSharedOptions";
import toast from "react-hot-toast";

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

	const allSelected = profiles.every(
		(p) => tobaccoHistoryData[p.profileName] !== null
	);

	const handlePrev = () => navigate("/lifestyle/habit-history-2");

	const handleNext = () => {
		if (!allSelected) {
			toast.error("Please select usage for all profiles before continuing.");
			return;
		}
		navigate("/medical-history");
	};

	const sanitizedSelectedValues = Object.fromEntries(
		Object.entries(tobaccoHistoryData).filter(
			([_, val]) => val !== null && val !== undefined
		)
	) as Record<string, TobaccoUsage>;

	return (
		<div className="flex flex-col max-w-5xl mx-auto h-[calc(100vh-4rem)] p-6">
			<div className="text-center text-2xl font-semibold text-gray-900 mb-6">
				<h2>
					How often do the person use {" "}
					<span className="text-[#0B1761]">tobacco</span> products?
				</h2>
				<p className="text-sm text-gray-500 mt-2 font-semibold">
					(like cigarettes, vaping, gutkha, etc.)
				</p>
			</div>

			<div className="flex-1 overflow-hidden">
				<div className="bg-white rounded-lg shadow-sm h-[calc(100%-1rem)] overflow-y-auto p-6 space-y-6 border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300">
					<NewSharedOptions<TobaccoUsage>
						profiles={profiles}
						options={["Under 5 units", "6 to 10 units", "Over 10 units"]}
						selectedValues={sanitizedSelectedValues}
						onOptionSelect={handleOptionSelect}
					/>
				</div>
			</div>

			<div className="border-t border-gray-200 mt-4 pt-4">
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
