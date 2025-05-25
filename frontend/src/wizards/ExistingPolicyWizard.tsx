import React, { useState } from 'react';
import ExistingInsurance from '../components/common/ExistingInsaurance';
import ExistingPoliciesPage from '../components/common/ExistingPolicyPage';
import type { PolicyData } from '../components/common/ExistingPolicyPage';

const plans = [
  { value: 'plan-a', label: 'Plan A' },
  { value: 'plan-b', label: 'Plan B' },
];
const membersForPolicy = [
  { value: 'self',   label: 'You'    },
  { value: 'spouse', label: 'Spouse' },
  { value: 'father', label: 'Father' },
];

export default function ExistingPolicyWizard() {
  const [step, setStep]   = useState(0); // 0 = count, 1 = details
  const [count, setCount] = useState(0);
  const [data, setData]   = useState<PolicyData[]>([]);

  if (step === 0) {
    return (
      <ExistingInsurance
        onPrev={() => window.location.href = '/medicalreview'}
        onNext={(c) => {
          setCount(c);
          setStep(c ? 1 : 2);
        }}
      />
    );
  }

  if (step === 1) {
    return (
      <ExistingPoliciesPage
        planCount={count}
        policyOptions={plans}
        memberOptions={membersForPolicy}
        onPrev={() => setStep(0)}
        onReview={(d) => {
          setData(d);
          window.location.href = '/finaldata';
        }}
      />
    );
  }

  // no policies → go straight to final
  window.location.href = '/finaldata';
  return null;
}
