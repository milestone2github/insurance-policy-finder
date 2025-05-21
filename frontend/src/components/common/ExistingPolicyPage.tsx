// src/pages/ExistingPoliciesPage.tsx

import React, { useState, useEffect } from 'react';
import InsurancePolicyForm, {
  type InsurancePolicyData,
} from '../shared/InsaurancePolicyForm';
import SmallButton from '../shared/SmallButton';
import type { SelectOption } from '../types';

interface ExistingPoliciesPageProps {
  planCount: number;                             // from step 4
  policyOptions: SelectOption[];                 // dropdown options for plans
  memberOptions: SelectOption[];                 // members (You, Spouse, etc.)
  onPrev: () => void;                            // go back to step 4
  onReview: (allData: InsurancePolicyData[]) => void; // final review callback
}

const ExistingPoliciesPage: React.FC<ExistingPoliciesPageProps> = ({
  planCount,
  policyOptions,
  memberOptions,
  onPrev,
  onReview,
}) => {
  // initialize an array of length planCount with empty structures
  const [forms, setForms] = useState<InsurancePolicyData[]>([]);

  useEffect(() => {
    setForms(
      Array.from({ length: planCount }, () => ({
        plan: '',
        otherPlanName: '',
        coverAmount: '',
        renewalDate: '',
        policyType: '',
        memberCovered: '',
        membersCovered: [],
      }))
    );
  }, [planCount]);

  // update a single form's data
  const handleChange = (idx: number) => (data: InsurancePolicyData) => {
    setForms((prev) => {
      const next = [...prev];
      next[idx] = data;
      return next;
    });
  };

  // only enable Review if every form is “complete”
  const allValid = forms.every((f) => {
    if (!f.plan || !f.coverAmount || !f.renewalDate || !f.policyType) {
      return false;
    }
    return f.policyType === 'floater'
      ? f.membersCovered.length > 0
      : f.memberCovered !== '';
  });

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <h1 className="text-2xl font-bold text-center">
        Please share the details of your existing policies.
      </h1>

      {/* Render N forms */}
      {forms.map((data, idx) => (
        <InsurancePolicyForm
          key={idx}
          index={idx + 1}
          policyOptions={policyOptions}
          memberOptions={memberOptions}
          initialData={data}
          onChange={handleChange(idx)}
        />
      ))}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <SmallButton variant="outline" onClick={onPrev}>
          Previous
        </SmallButton>
        <SmallButton
          variant={allValid ? 'solid' : 'outline'}
          onClick={() => allValid && onReview(forms)}
          disabled={!allValid}
          className={!allValid ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Review
        </SmallButton>
      </div>
    </div>
  );
};

export default ExistingPoliciesPage;
