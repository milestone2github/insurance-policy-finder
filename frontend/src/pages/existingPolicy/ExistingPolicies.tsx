import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { resetAllState } from '../../store/resetSlice';
import { resetExistingPolicyData, setHasExistingPolicy, setPolicyCount } from '../../store/ExistingPolicySlice';
import LargeButton from '../../components/shared/LargeButton';
import SmallButton from '../../components/shared/SmallButton';

const ExistingPolicies = () => {
  const dispatch = useDispatch();
	const navigate = useNavigate();

	const profileData = useSelector((s: RootState) => s.profiles.profileData);
	
  const existingPolicy = useSelector((s: RootState) => s.existingPolicy);
	const hasExistingPolicy = existingPolicy.hasExistingPolicy ?? null;

  useEffect(() => {
    const hasSelected = Object.values(profileData).some((p) => p.selected);
    if (!hasSelected) {
      dispatch(resetAllState());
      navigate("/");
    }
  }, [profileData, navigate, dispatch]);

  const handleNext = () => {
    if (hasExistingPolicy === false) {
      dispatch(resetExistingPolicyData());
      navigate("/review");
    }
    if (hasExistingPolicy === true && existingPolicy.policyCount) {
			navigate("/policies/info");
		}
  };
  
  const handlePrev = () => {
    if (hasExistingPolicy === false) {
      dispatch(resetExistingPolicyData());
    }
    navigate("/medical-history");
  };
  
  return (
		<div className="max-w-2xl mx-auto space-y-8 py-16">
			<h2 className="text-2xl font-bold text-center text-gray-800">
				Do any of the following have existing health insurance policies?
			</h2>

			<div className="grid grid-cols-2 gap-4">
				<LargeButton
					label="Yes"
					selected={hasExistingPolicy === true}
					onClick={() => dispatch(setHasExistingPolicy(true))}
				/>
				<LargeButton
					label="No"
					selected={hasExistingPolicy === false}
					onClick={() => dispatch(setHasExistingPolicy(false))}
				/>
			</div>

			{hasExistingPolicy === true && (
				<div className="text-center mt-[5rem] space-y-2">
					<h3 className="text-md font-medium text-gray-700">
						How many existing policies?
					</h3>
					<div className="flex gap-6 mt-6 justify-center">
						{[1, 2, 3, 4, 5].map((count) => (
							<div
								key={count}
								role="button"
								onClick={() => dispatch(setPolicyCount(count))}
								className={`px-6 py-4 rounded-lg border transition text-center cursor-pointer font-semibold ${
									existingPolicy.policyCount === count
										? "bg-blue-500 text-white border-blue-500"
										: "bg-white text-gray-700 border-gray-300 hover:shadow-md"
								}`}
							>
								{count}
							</div>
						))}
					</div>
				</div>
			)}

			<div className="flex justify-center pt-6 gap-8">
				<SmallButton variant="ghost" color="gray" onClick={handlePrev}>
					Previous
				</SmallButton>
				<SmallButton
					variant="solid"
					color="blue"
					onClick={handleNext}
					disabled={
						hasExistingPolicy === null ||
						(hasExistingPolicy === true && existingPolicy.policyCount === null)
					}
				>
					Next
				</SmallButton>
			</div>
		</div>
	);
}

export default ExistingPolicies