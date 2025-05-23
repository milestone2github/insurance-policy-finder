import React, { useState } from 'react';
import YesNoStep from './components/common/YesNoMemberStep';
import AdverseDetails from './components/common/AdverseDetails';
import ExistingInsurance from './components/common/ExistingInsaurance';
import ExistingPoliciesPage from './components/common/ExistingPolicyPage';
import type { ProfileType, Member } from './components/common/MadicalReview';
import ReviewPage from './components/common/ReviewPage';
import SelfIcon from "./assets/icons/SelfIcon.png";
import SpouseIcon from "./assets/icons/SpouseIcon.png";
import FatherIcon from "./assets/icons/FatherIcon.png";
import MotherIcon from "./assets/icons/MotherIcon.png";
import SonIcon from "./assets/icons/SonIcon.png";
import DaughterIcon from "./assets/icons/DaughterIcon.png";

// 1) Member definitions
const ALL_MEMBERS: Member[] = [
  { type: 'self', label: 'You', age: undefined, avatarUrl: SelfIcon },
  { type: 'spouse', label: 'Spouse', age: undefined, avatarUrl: SpouseIcon },
  { type: 'father', label: 'Dam Good', age: 55, avatarUrl: FatherIcon },
  { type: 'mother', label: 'Mother', age: undefined, avatarUrl: MotherIcon },
  { type: 'son', label: 'Son', age: undefined, avatarUrl: SonIcon },
  { type: 'daughter', label: 'Daughter', age: undefined, avatarUrl: DaughterIcon },
];


// 2) Dropdown data for policies
const plans = [
  { value: 'plan-a', label: 'Plan A' },
  { value: 'plan-b', label: 'Plan B' },
];
const membersForPolicy = [
  { value: 'self', label: 'You' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'father', label: 'Father' },
];

type Step =
  | 'Q1'                  // Medical history?
  | 'Q2'                  // Adverse findings?
  | 'Q3'                  // Hospitalization?
  | 'Details'             // Pick members + find‐types
  | 'ExistingInsurance'   // ExistingInsurance component
  | 'ExistingPolicies'   // ExistingPoliciesPage
  | 'Review';   // Review

export default function App() {
  const DUMMY_PERSONAL = [
    { name: 'Dam Good', gender: 'Male', dob: '01-01-1970' },
    { name: 'jdid', gender: 'Female', dob: '08-01-1992' },
  ];

  const DUMMY_LIFESTYLE = [
    { name: 'Dam Good', fitness: 'Obese', consumesAlcohol: 'Yes (5+)', consumesTobacco: 'No' },
    { name: 'jdid', fitness: 'Fit', consumesAlcohol: 'Yes (2+)', consumesTobacco: 'Yes (1-2)' },
  ];

  const DUMMY_MEDICAL = [
    { name: 'Dam Good', hasHistory: true, findings: ['ACL tear'], hospitalized: true },
    { name: 'jdid', hasHistory: false, findings: [], hospitalized: false },
  ];
  const [step, setStep] = useState<Step>('Q1');
  const [toDetail, setToDetail] = useState<ProfileType[]>([]);
  const [adverseAnswers, setAdverseAnswers] = useState<Record<ProfileType, any>>({});
  const [planCount, setPlanCount] = useState(0);
  const [policiesData, setPoliciesData] = useState<any[]>([]);
  // Q1 → Q2 or Details
  const handleQ1 = (selected: ProfileType[]) => {
    if (selected.length > 0) {
      setToDetail(selected);
      setStep('Details');
    } else {
      setStep('Q2');
    }
  };

  // Q2 → Q3 or Details
  const handleQ2 = (selected: ProfileType[]) => {
    if (selected.length > 0) {
      setToDetail(selected);
      setStep('Details');
    } else {
      setStep('Q3');
    }
  };

  // Q3 → Details or ExistingInsurance
  const handleQ3 = (selected: ProfileType[]) => {
    if (selected.length > 0) {
      setToDetail(selected);
      setStep('Details');
    } else {
      setStep('ExistingInsurance');
    }
  };

  // After Details → ExistingInsurance
  const onDetailsNext = (answers: Record<ProfileType, any>) => {
    setAdverseAnswers(answers);
    setStep('ExistingInsurance');
  };

  // After ExistingInsurance → maybe ExistingPolicies
  const onExistingInsNext = (count: number) => {
    setPlanCount(count);
    if (count > 0) {
      setStep('ExistingPolicies');
    } else {
      // no plans → jump to Review
      setStep('Review');
    }
  };

  // Final review
  const onPoliciesReview = (data: any[]) => {
    // store it…
    setPoliciesData(data);
    // …and go to the Review step
    setStep('Review');
  };

  return (
    <>
      {step === 'Q1' && (
        <YesNoStep
          question="Do you or anyone in your family have a medical history, other than common cold or fever?"
          members={ALL_MEMBERS}
          onNext={handleQ1}
        />
      )}

      {step === 'Q2' && (
        <YesNoStep
          question="Were there any adverse finding(s) in medical tests conducted in the last year?"
          members={ALL_MEMBERS}
          onPrev={() => setStep('Q1')}
          onNext={handleQ2}
        />
      )}

      {step === 'Q3' && (
        <YesNoStep
          question="Has there been any hospitalization in the family?"
          members={ALL_MEMBERS}
          onPrev={() => setStep('Q2')}
          onNext={handleQ3}
        />
      )}

      {step === 'Details' && (
        <AdverseDetails
          members={ALL_MEMBERS.filter((m) => toDetail.includes(m.type))}
          onPrev={() => setStep('Q3')}
          onNext={onDetailsNext}
        />
      )}

      {step === 'ExistingInsurance' && (
        <ExistingInsurance
          onPrev={() => setStep('Details')}
          onNext={onExistingInsNext}
        />
      )}

      {step === 'ExistingPolicies' && (
        <ExistingPoliciesPage
          planCount={planCount}
          policyOptions={plans}
          memberOptions={membersForPolicy}
          onPrev={() => setStep('ExistingInsurance')}
          onReview={onPoliciesReview}
        />
      )}
      {step === 'Review' && (
        <ReviewPage
          personal={DUMMY_PERSONAL}
          lifestyle={DUMMY_LIFESTYLE}
          medical={DUMMY_MEDICAL}
          policies={policiesData}
          onEditSection={(section) => {
            // e.g. map 1→Q1, 2→lifestyle, 3→Details, 4→ExistingInsurance
            const map: Record<number, Step> = {
              1: 'Q1',
              2: 'Q2',
              3: 'Details',
              4: 'ExistingInsurance',
            };
            setStep(map[section]);
          }}
          onConfirm={() => {
            // final submit logic here
            console.log('Submitting everything...');
          }}
        />
      )}
    </>
  );
}
