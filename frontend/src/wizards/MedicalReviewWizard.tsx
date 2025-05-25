import React, { useState } from 'react';
import YesNoStep from '../components/common/YesNoMemberStep';
import AdverseDetails from '../components/common/AdverseDetails';
import type { ProfileType } from '../components/common/MadicalReview';
import { ALL_MEMBERS } from '../constants/members';

type Answers = Record<ProfileType, any>;

export default function MedicalReviewWizard() {
  const [step, setStep] = useState(0); // 0,1,2 = YesNo steps; 3 = details
  const [selected, setSelected] = useState<ProfileType[]>([]);
  const [answers, setAnswers]   = useState<Answers>({} as Answers);

  const questions = [
    'Do you or anyone in your family have a medical history, other than common cold or fever?',
    'Were there any adverse finding(s) in medical tests conducted in the last year?',
    'Has there been any hospitalization in the family?',
  ];

  const handleNext = (sel: ProfileType[]) => {
    if (sel.length) setSelected(sel);
    setStep(step + 1);
  };

  switch (step) {
    case 0:
    case 1:
    case 2:
      return (
        <YesNoStep
          question={questions[step]}
          members={ALL_MEMBERS}
          onPrev={step > 0 ? () => setStep(step - 1) : undefined}
          onNext={handleNext}
        />
      );

    case 3:
      return (
        <AdverseDetails
          members={ALL_MEMBERS.filter(m => selected.includes(m.type))}
          onPrev={() => setStep(2)}
          onNext={(ans) => {
            setAnswers(ans);
            window.location.href = '/existingpolicy';
          }}
        />
      );

    default:
      return null;
  }
}
