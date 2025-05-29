// Medical page options common hook
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store";
import {
	clearProfileSelections,
	setActiveQuestion,
	toggleProfileSelection,
} from "../store/MedicalConditionSlice";

export const useMedicalQuestion = (
	step: "medicalHistory" | "medicalTest" | "hospitalisation",
	nextPath: string,
	prevPath?: string
) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { activeQuestion, selectedProfiles } = useSelector(
		(state: RootState) => state.medicalCondition
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
		if (activeQuestion === step && selectedProfiles.length > 0) {
			navigate("/medical/data");
		} else {
			navigate(nextPath);
		}
	};

	const handlePrevious = () => {
		if (prevPath) navigate(prevPath);
	};

	const toggleProfile = (key: string) => {
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
