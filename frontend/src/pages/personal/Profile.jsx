import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { defaultProfilesMap } from "../../utils/constants";
import {
	toggleProfile,
	incrementProfile,
	decrementProfile,
} from "../../store/ProfileSlice";
import { syncPersonalDataWithSelection } from "../../store/PersonalSlice";
import { useEffect } from "react";
import ProfileSelection from "../../components/shared/ProfileSelection";
import SmallButton from "../../components/shared/SmallButton";

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const profiles = useSelector(
		(state) => state.profiles.profileData
	);
	// const personalDetails = useSelector(
	// 	(state: RootState) => state.personal.personalInfo
	// );

	useEffect(() => {
		if (!profiles || Object.keys(profiles).length === 0) {
			navigate("/");
		}
	}, [profiles, navigate]);

	const handleSelect = (key, countable) => {
		if (countable) {
			if (!profiles[key].selected) {
				dispatch(incrementProfile(key));
			}
		} else {
			dispatch(toggleProfile(key));
		}
	};

	const handleCountChange = (key, delta) => {
		if (delta > 0) {
			dispatch(incrementProfile(key));
		} else {
			dispatch(decrementProfile(key));
		}
	};

	const handleNext = () => {
		dispatch(syncPersonalDataWithSelection(profiles));
		navigate("/personal/input-names");
	};

	const isDisabled = Object.values(profiles).every(
		(val) => !val.selected || (val.countable && val.count === 0)
	);

	return (
		<div className="flex flex-col justify-baseline h-screen bg-[#f9f9f9]">
			{/* Page Title */}
			<div className="text-center mt-10 mb-6 px-4">
				<h1 className="text-2xl font-semibold text-gray-900">
					Tell us about the people you'd like to{" "}
					<span className="text-[#0B1761]">insure</span>
				</h1>
				<p className="text-sm text-gray-500 mt-2">
					Help us with the following information.
				</p>
			</div>

			{/* White Box with Profile Selections */}
			{/* <div className="xl:w-3/4 xl:min-h-1/2 xl:max-h-4/5 mx-auto px-4 sm:px-6"> */}
			<div className="xl:w-4/5 xl:h-fit mx-auto px-auto sm:px-6">
				{/* <div className="w-fit mx-auto bg-white rounded-lg border border-gray-200 shadow-sm px-6 sm:px-12 py-8"> */}
				<div className="flex flex-col xl:h-fit bg-white rounded-lg border border-gray-200 shadow-sm px-6 sm:px-12 py-8">
					<h2 className="text-center text-sm text-gray-700 mb-4">
						Select the Members you want to assure
					</h2>
					<div className="grid grid-cols-2 gap-4 xl:gap-10 py-6">
						{defaultProfilesMap.map(({ profileType }) => {
							const data = profiles[profileType];
							if (!data) return null;
							// const isChild =
							// 	profileType === "son" || profileType === "daughter";
							// const personalName =
							// 	!isChild && !data.countable
							// 		? (
							// 				personalDetails?.[profileType as ProfileType] as
							// 					| PersonalData
							// 					| undefined
							// 		  )?.name
							// 		: undefined;

							return (
								<ProfileSelection
									key={profileType}
									profileType={profileType}
									// label={personalName || data.label}
									label={data.label}
									selected={data.selected}
									count={data.countable ? data.count : undefined}
									onSelect={() => handleSelect(profileType, data.countable)}
									onCountChange={
										data.countable
											? (delta) => handleCountChange(profileType, delta)
											: undefined
									}
								/>
							);
						})}
					</div>
				</div>
			</div>

			{/* Bottom Button */}
			<div className="w-full max-w-2xl mx-auto mt-8">
				<div className="border border-t-gray-100 opacity-10"></div>
				{/* <div className="mt-6 mb-10 flex justify-center">
					<button
						onClick={handleNext}
						disabled={isDisabled}
						className={`px-8 py-2 rounded font-semibold text-white ${
							isDisabled
								? "bg-gray-300 cursor-not-allowed"
								: "bg-[#0B1761] hover:bg-[#091355]"
						}`}
					>
						Next
					</button>
				</div> */}
				<div className="mt-6 mb-10 flex justify-center">
					<SmallButton
						onClick={handleNext}
						color="darkblue"
						variant="solid"
						className={
							isDisabled
								? "bg-gray-300 cursor-not-allowed pointer-events-none"
								: ""
						}
						disabled={isDisabled}
					>
						Next
					</SmallButton>
				</div>
			</div>
		</div>
	);	
};

export default Profile;
