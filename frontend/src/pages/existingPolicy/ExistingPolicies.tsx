import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { resetAllState } from '../../store/resetSlice';
import { resetExistingPolicyData, setHasExistingPolicy, setPolicyCount } from '../../store/ExistingPolicySlice';
import LargeButton from '../../components/shared/LargeButton';
import SmallButton from '../../components/shared/SmallButton';
import toast from 'react-hot-toast';

const ExistingPolicies = () => {
  const dispatch = useDispatch();
	const navigate = useNavigate();

	const profileData = useSelector((s: RootState) => s.profiles.profileData);
	const medicalData = useSelector((s: RootState) => s.medicalCondition.activeQuestion);
	
  const existingPolicy = useSelector((s: RootState) => s.existingPolicy);
	const hasExistingPolicy = existingPolicy.hasExistingPolicy ?? null;

  useEffect(() => {
    const hasSelected = Object.values(profileData).some((p) => p.selected);
    if (!hasSelected) {
      dispatch(resetAllState());
      navigate("/");
    }
  }, [profileData, navigate, dispatch]);

  // const handleNext = () => {
  //   if (hasExistingPolicy === false) {
  //     dispatch(resetExistingPolicyData());
  //     navigate("/review");
  //   }
  //   if (hasExistingPolicy === true && existingPolicy.policyCount) {
	// 		navigate("/policies/info");
	// 	}
  // };
	const handleNext = () => {
		if (hasExistingPolicy === false) {
			dispatch(resetExistingPolicyData());
			navigate("/review");
			return;
		}

		if (hasExistingPolicy === true) {
			if (!existingPolicy.policyCount) {
				toast.error("Please select how many existing policies.");
				return;
			}
			navigate("/policies/info");
		}
	};
	  
  const handlePrev = () => {
    if (hasExistingPolicy === false) {
      dispatch(resetExistingPolicyData());
    }
		if (medicalData === null) {
			navigate("/medical-history");
		} else {
			navigate("/medical/data");
		}
  };
  
	return (
		<div className="max-w-2xl mx-auto py-12 px-4">
			<h2 className="text-2xl font-semibold text-center mb-8">
				Do any of the following have{" "}
				<span className="text-[#0B1761]">
					existing health insurance policies?
				</span>
			</h2>

			<div className="flex justify-center space-x-6 mb-8 flex-nowrap px-2">
				<LargeButton
					label="Yes"
					selected={hasExistingPolicy === true}
					onClick={() => dispatch(setHasExistingPolicy(true))}
				/>
				<LargeButton
					label="No"
					selected={hasExistingPolicy === false}
					onClick={() => {
						dispatch(resetExistingPolicyData());
						dispatch(setHasExistingPolicy(false));
					}}
				/>
			</div>

			{hasExistingPolicy && (
				<div className="bg-white rounded-lg shadow p-6 mt-6">
					<p className="text-center mb-6 font-semibold">
						How many retail health insurance plans do you have?
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						{[1, 2, 3, 4, 5].map((count) => (
							<div
								key={count}
								role="button"
								onClick={() => dispatch(setPolicyCount(count))}
								className={`w-18 h-12 flex items-center justify-center rounded-lg border font-semibold transition cursor-pointer ${
									existingPolicy.policyCount === count
										? "bg-[#203b6b] text-white border-[#203b6b]"
										: "bg-white text-gray-700 border-gray-300 hover:shadow"
								}`}
							>
								{count}
							</div>
						))}
					</div>
				</div>
			)}

			<div className="border-t border-gray-200 mt-8 pt-4">
				<div className="flex justify-center gap-5 flex-wrap">
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

export default ExistingPolicies