import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/index";
import { toggleProfile, incrementProfile,	decrementProfile, saveProfiles } from "../../store/profile/ProfileSlice";
import ProfileButton from "../../components/shared/ProfileButton";
import type { ProfileType } from "../../utils/interfaces";
import { defaultProfilesMap } from "../../utils/constants";
// import { defaultProfilesMap } from "../../utils/constants";

const Personal = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const selectProfiles = (state: RootState) => state.profileSelection.profiles;
	const personalData = (state: RootState) => state.personal.personalDetails;
	const profiles = useSelector(selectProfiles);
	const personalDetails = useSelector(personalData);

	const handleSelect = (key: ProfileType, countable: boolean) => {
		if (countable) {
			if (!profiles[key].selected) {
				dispatch(incrementProfile(key)); // Initial select + count 1
			}
		} else {
			dispatch(toggleProfile(key));
		}
	};

	const handleCountChange = (key: ProfileType, delta: number) => {
		if (delta > 0) {
			dispatch(incrementProfile(key));
		} else {
			dispatch(decrementProfile(key));
		}
	};

	const handleNext = () => {
		dispatch(saveProfiles({ profiles })); // Save current profile state
		navigate("/personal/input-names");
	};

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
				{/* {Object.entries(profiles).map(([key, data]) => {
					const profileType = key as ProfileType; */}

				{defaultProfilesMap.map(({ profileType }) => {
					const data = profiles[profileType];
					const personalName = personalDetails[profileType as ProfileType]?.name;
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

				{/* // const data = profiles[profile.profileType]; // const nameLabel =
				profileNames[profile.profileType] || profile.label; */}
				{/* {defaultProfiles.map((profile) => {
					const data = profiles[profile.profileType];
					return (
						<ProfileButton
							key={profile.profileType}
							profileType={profile.profileType}
							label={profile.label}
							selected={data.selected}
							count={profile.countable ? data.count : undefined}
							onSelect={() =>
								handleSelect(profile.profileType, profile.countable)
							}
							onCountChange={
								profile.countable
									? (delta) => handleCountChange(profile.profileType, delta)
									: undefined
							}
						/>
					);
				})} */}
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

export default Personal;
