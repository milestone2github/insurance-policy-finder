// src/components/common/MedicalReview.tsx

import React, { useState } from 'react';
import LargeButton from '../shared/LargeButton';
import ProfileButton from './ProfileButton';
import SmallButton from '../shared/SmallButton';

export type ProfileType =
  | 'self'
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'father'
  | 'mother';

export interface Member {
  type: ProfileType;
  label: string;
  age?: number;
}

interface MedicalReviewProps {
  /** Called with the array of selected ProfileType when Next is clicked */
  onNext: (selected: ProfileType[]) => void;
  /** Optional: handle “Previous” if needed */
  onPrev?: () => void;
}

const familyMembers: Member[] = [
  { type: 'self',    label: 'You' },
  { type: 'spouse',  label: 'Spouse' },
  { type: 'father',  label: 'Dam Good', age: 55 },
  { type: 'mother',  label: 'Mother' },
  { type: 'son',     label: 'Son' },
  { type: 'daughter',label: 'Daughter' },
];

const MedicalReview: React.FC<MedicalReviewProps> = ({ onNext, onPrev }) => {
  const [hasAdverse, setHasAdverse] = useState<boolean | null>(null);
  const [selected, setSelected]     = useState<ProfileType[]>([]);

  const onAdverseClick = (value: boolean) => {
    setHasAdverse(value);
    if (!value) setSelected([]);
  };

  const toggleMember = (type: ProfileType) =>
    setSelected(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );

  // enable Next if “No” is chosen, or at least one member selected when “Yes”
  const nextEnabled =
    hasAdverse === false ||
    (hasAdverse === true && selected.length > 0);

  return (
    <div className="max-w-3xl mx-auto py-12">
      {/* Question */}
      <h1 className="text-2xl font-bold text-center mb-8">
        Do you or anyone in your family have a medical history, other than common cold or fever?
      </h1>

      {/* Yes / No */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <LargeButton
          label="Yes"
          selected={hasAdverse === true}
          onClick={() => onAdverseClick(true)}
        />
        <LargeButton
          label="No"
          selected={hasAdverse === false}
          onClick={() => onAdverseClick(false)}
        />
      </div>

      {/* Member picker if “Yes” */}
      {hasAdverse && (
        <>
          <p className="text-center mb-6">
            Please select the family member(s) whose test results showed adverse finding(s).
          </p>
          <div className="grid grid-cols-3 gap-6 justify-items-center mb-12">
            {familyMembers.map(member => (
              <ProfileButton
                key={member.type}
                profileType={member.type}
                label={
                  member.age
                    ? `${member.label} (${member.age} yrs)`
                    : member.label
                }
                selected={selected.includes(member.type)}
                onSelect={() => toggleMember(member.type)}
              />
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        {onPrev && (
          <SmallButton variant="outline" onClick={onPrev}>
            Previous
          </SmallButton>
        )}
        <SmallButton
          variant="solid"
          onClick={() => onNext(selected)}
          disabled={!nextEnabled}
          className={!nextEnabled ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Next
        </SmallButton>
      </div>
    </div>
  );
};

export default MedicalReview;
