import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "../../components/shared/ProfileButton";
import type { RootState } from "../../store/index";
import { defaultProfilesMap } from "../../utils/constants";
import type { PersonalData, ProfileType } from "../../utils/interfaces";
import { toggleProfile, incrementProfile,	decrementProfile } from "../../store/ProfileSlice";
import { syncPersonalDataWithSelection } from "../../store/PersonalSlice";
import { useEffect } from "react";

const Profile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const profiles = useSelector((state: RootState) => state.profiles.profileData);
	const personalDetails = useSelector((state: RootState) => state.personal.personalInfo);

	// Navigate to Home if no field(s) are found
	useEffect(() => {
		if (!profiles || Object.keys(profiles).length === 0) {
			navigate("/");
		}
	}, [profiles, navigate]);

	const handleSelect = (key: ProfileType, countable: boolean) => {
		if (countable) {
			if (!profiles[key].selected) {
				dispatch(incrementProfile(key)); // Initial select + count 1
			}
		} else {
			dispatch(toggleProfile(key));
		}
	};

	// Count logic to count no. of son/daughter
	const handleCountChange = (key: ProfileType, delta: number) => {
		if (delta > 0) {
			dispatch(incrementProfile(key));
		} else {
			dispatch(decrementProfile(key));
		}
	};

	// Save form data to localstorage and update the state
	const handleNext = () => {
		dispatch(syncPersonalDataWithSelection(profiles));	// Sync latest selection information with pre-stored states
		navigate("/personal/input-names");
	};

	// Next Button is disabled if no values are selected
	const isDisabled = Object.values(profiles).every(
		(val) => !val.selected || (val.countable && val.count === 0)
	);

	return (
		<div className="p-8 flex flex-col items-center">
			<h2 className="text-2xl font-bold mb-2">
				Hello! Let’s start. Tell us who you’d like to cover!
			</h2>
			<p className="mb-6">Please provide the following details.</p>
			<div className="flex gap-4 flex-wrap justify-center mb-6">
				{defaultProfilesMap.map(({ profileType }) => {
					const data = profiles[profileType];

					// Name labels logic on first page
					const isChild = profileType === "son" || profileType === "daughter";
					const personalName =
						!isChild && !data.countable
							? (personalDetails?.[profileType as ProfileType] as PersonalData | undefined)?.name
							: undefined;
					return (
						<ProfileButton
							key={profileType}
							profileType={profileType}
							label={personalName || data.label}
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
			<button
				onClick={handleNext}
				disabled={isDisabled}
				className={`px-6 py-2 rounded text-white ${
					isDisabled ? "bg-gray-300" : "bg-green-500"
				}`}
			>
				Next
			</button>
		</div>
	);
};

export default Profile;
