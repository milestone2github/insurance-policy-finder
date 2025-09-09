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
import { useProgressValue } from "../../utils/ProgressContext";
import { sendDataToDb } from "../../utils/upsertDb";
import { useState } from "react";
import LeadCaptureModal from "../../components/shared/LeadCaptureModal";

const Profile = () => {
	const progressPercent = useProgressValue();
	// console.log("Progress Percent Value ==> ", progressPercent); // debug

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const profiles = useSelector((state) => state.profiles.profileData);
	const selfName = useSelector(
		(state) => state.personal.personalInfo?.myself?.name
	);
	// const [isOpened, setIsOpened] = useState(false);
	const [showLeadModal, setShowLeadModal] = useState(false);

	// Lead Modal
	useEffect(() => {
		const showModal = setTimeout(() => {
			const token = localStorage.getItem("authToken");
			if (!token) {
				setShowLeadModal(true);
				return;
			}
		}, 5000); // Open Modal after 5 seconds if token isn't found in localStorage

		return () => clearTimeout(showModal);
	}, []);

	useEffect(() => {
		if (!profiles || Object.keys(profiles).length === 0) {
			navigate("/");
		}
		// setIsOpened(true);
	}, [profiles, navigate]);

	// Update isOpened field to true in DB (authToken fetched from URL)
	useEffect(() => {
		const token = localStorage.getItem("authToken");
  	const isUpdated = localStorage.getItem("isDbUpdated");	// Ensures this updation runs strictly once per session
		
		if (token && !isUpdated) {
			sendDataToDb(1, 0, true);	// Returning User
			localStorage.setItem("isDbUpdated", "true");
		}
	}, []);

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

	const handleNext = async () => {
		dispatch(syncPersonalDataWithSelection(profiles));
		await sendDataToDb(1, progressPercent);
		if (!localStorage.getItem("authToken")) {
			setShowLeadModal(true);
			return;
		}
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
				<div className="flex justify-center w-3/5 xl:w-full mt-6 mb-10 mx-auto">
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

			{/* Lead generation modal popup */}
			<LeadCaptureModal
				isOpen={showLeadModal}
				defaultName={selfName ? selfName : ""}
				onClose={() => setShowLeadModal(false)}
				onSubmit={() => {
					setShowLeadModal(false);
					navigate("/personal/input-names");
				}}
			/>
		</div>
	);
};

export default Profile;
