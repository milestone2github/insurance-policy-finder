// Medical page options common hook
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	clearProfileSelections,
	setActiveQuestion,
	toggleProfileSelection,
} from "../store/MedicalConditionSlice";
import toast from "react-hot-toast";

export const useMedicalQuestion = (
	step,
	nextPath,
	prevPath
) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { activeQuestion, selectedProfiles } = useSelector(
		(state) => state.medicalCondition
	);

	const handleYes = () => {
		dispatch(setActiveQuestion(step));
	};

	const handleNo = () => {
		dispatch(setActiveQuestion(null));
		dispatch(clearProfileSelections());
		// DON'T navigate here, wait for Next button
	};

	const handleNext = () => {
		if (activeQuestion === step) {
			if (selectedProfiles.length > 0) {
				navigate("/medical/data");
			} else {
				toast.error("Please select atleast one member.");
			}
		} else {
			navigate(nextPath);
		}
	};

	const handlePrevious = () => {
		if (prevPath) navigate(prevPath);
	};

	const toggleProfile = (key) => {
		dispatch(toggleProfileSelection({ profileKey: key }));
	};

	return {
		activeQuestion,
		selectedProfiles,
		handleYes,
		handleNo,
		handleNext,
		handlePrevious,
		toggleProfile,
	};
};
