// src/components/common/ExistingInsurance.tsx

import React, { useState } from 'react';
import LargeButton from '../shared/LargeButton';
import OptionCard from '../shared/OptionCard';
import SmallButton from '../shared/SmallButton';

interface ExistingInsuranceProps {
  onPrev: () => void;
  onNext: (count: number) => void;
}

const PLAN_COUNTS = [1, 2, 3, 4, 5];

const ExistingInsurance: React.FC<ExistingInsuranceProps> = ({ onPrev, onNext }) => {
  const [hasInsurance, setHasInsurance] = useState<boolean | null>(null);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);

  const handleYesNo = (val: boolean) => {
    setHasInsurance(val);
    if (!val) setSelectedCount(null);
  };

  const canNext =
    hasInsurance === false ||
    (hasInsurance === true && selectedCount !== null);

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      {/* Question */}
      <h1 className="text-2xl font-bold text-center">
        Do you have any existing retail health insurance policies?
      </h1>

      {/* Yes / No */}
      <div className="grid grid-cols-2 gap-6">
        <LargeButton
          label="Yes"
          selected={hasInsurance === true}
          onClick={() => handleYesNo(true)}
        />
        <LargeButton
          label="No"
          selected={hasInsurance === false}
          onClick={() => handleYesNo(false)}
        />
      </div>

      {/* If Yes, show 1–5 cards */}
      {hasInsurance && (
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <label className="block mb-4 font-medium">
            How many retail health insurance plans do you have?*
          </label>
          <div className="grid grid-cols-5 gap-4">
            {PLAN_COUNTS.map((n) => (
              <OptionCard
                key={n}
                label={String(n)}
                selected={selectedCount === n}
                onClick={() => setSelectedCount(n)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <SmallButton variant="outline" onClick={onPrev}>
          Previous
        </SmallButton>
        <SmallButton
          variant={canNext ? 'solid' : 'outline'}
          onClick={() => onNext(hasInsurance ? selectedCount! : 0)}
          disabled={!canNext}
          className={!canNext ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Next
        </SmallButton>
      </div>
    </div>
  );
};

export default ExistingInsurance;

