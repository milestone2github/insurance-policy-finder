import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { resetAllState } from "../../../store/resetSlice";
import { setAlcoholHistory } from "../../../store/LifestyleSlice";
import SmallButton from "../../../components/shared/SmallButton";
import NewSharedOptions from "../../../components/shared/NewSharedOptions";
import toast from "react-hot-toast";
import { sendDataToDb } from "../../../utils/upsertDb";
import { useProgressValue } from "../../../utils/ProgressContext";

export default function Frequency() {
	const progressPercent = useProgressValue();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const profileData = useSelector((s) => s.profiles.profileData);
	const personalInfo = useSelector((s) => s.personal.personalInfo);
	const alcoholHistory = useSelector(
		(s) => s.lifestyle.alcoholHistory
	);
	const alcoholHistoryData = alcoholHistory.alcoholHistoryData || {};

	useEffect(() => {
		const hasSelected = Object.values(profileData).some((p) => p.selected);
		if (!hasSelected) {
			dispatch(resetAllState());
			navigate("/");
		}
	}, [profileData, navigate, dispatch]);

	const profiles = useMemo(() => {
		if (!alcoholHistory.hasHistory) return [];

		return Object.entries(personalInfo)
			.filter(([key]) => key in alcoholHistoryData)
			.map(([profileName, data]) => ({
				profileName,
				data,
			}));
	}, [personalInfo, alcoholHistory, alcoholHistoryData]);

	const handleOptionSelect = (profileName, value) => {
		dispatch(setAlcoholHistory({ profileType: profileName, frequency: value }));
	};

	const handlePrev = () => navigate("/lifestyle/habit-history-1");
	
	const handleNext = async () => {
		if (!allSelected) {
			toast.error(
				"Please select a frequency for all profiles before continuing."
			);
			return;
		}
		await sendDataToDb(2, progressPercent)
		navigate("/lifestyle/habit-history-2");
	};

	const allSelected = profiles.every(
		(p) => alcoholHistoryData[p.profileName] !== null
	);

	const sanitizedSelectedValues = Object.fromEntries(
		Object.entries(alcoholHistoryData).filter(
			([_, val]) => val !== null && val !== undefined
		)
	);

	return (
		// <div className="flex flex-col max-w-5xl mx-auto h-[calc(100vh-4rem)] p-6">
		<div className="flex flex-col mx-auto md:min-w-4/5 lg:w-fit min-h-1/2 max-h-4/5 p-6">
			<div className="text-center text-2xl font-semibold text-gray-900 mb-6">
				<h2>
					How frequently do you drink{" "}
					<span className="text-[#0B1761]">alcohol</span> ?
				</h2>
				{/* <p className="text-sm text-gray-500 mt-2">
					This helps us personalize recommendations for a healthier lifestyle.
				</p> */}
			</div>

			<div className="flex-1 overflow-y-auto">
				<div className="
					flex
					justify-center
					bg-white
					rounded-lg
					shadow-sm
					h-[calc(100%-1rem)]
					overflow-y-auto
					p-6
					space-y-6
					border
					border-gray-200
					scrollbar-thin
					scrollbar-thumb-gray-300
				"
				>
					<NewSharedOptions
						profiles={profiles}
						options={["Daily", "Weekly", "Occasionally", "Rarely"]}
						selectedValues={sanitizedSelectedValues}
						onOptionSelect={handleOptionSelect}
					/>
				</div>
			</div>

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
