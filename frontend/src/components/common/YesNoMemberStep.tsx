import React, { useState } from 'react';
import LargeButton from '../shared/LargeButton';
import SmallButton from '../shared/SmallButton';
import ProfileButton from './ProfileButton';
import type { ProfileType, Member } from './MadicalReview';

interface YesNoStepProps {
  /** The question to ask */
  question: string;
  /** The list of members to pick from when “Yes” */
  members: Member[];
  /** Called with the array of selected ProfileType when Next is clicked */
  onNext: (selected: ProfileType[]) => void;
  /** Optional: handle “Previous” if needed */
  onPrev?: () => void;
}

export default function YesNoMemberStep({
  question,
  members,
  onNext,
  onPrev,
}: YesNoStepProps) {
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<ProfileType[]>([]);

  const choose = (v: boolean) => {
    setAnswer(v);
    if (!v) setSelected([]);
  };

  const toggleMember = (type: ProfileType) =>
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const nextEnabled =
    answer === false || (answer === true && selected.length > 0);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-bold text-center mb-8">
        {question}
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <LargeButton label="Yes" selected={answer === true} onClick={() => choose(true)} />
        <LargeButton label="No"  selected={answer === false} onClick={() => choose(false)} />
      </div>

      {answer === true && (
        <>
          <p className="text-center mb-6">Select family member(s):</p>
          <div className="grid grid-cols-3 gap-6 justify-items-center mb-12">
            {members.map((m) => (
              <ProfileButton
                key={m.type}
                profileType={m.type}
                label={m.age ? `${m.label} (${m.age} yrs)` : m.label}
                selected={selected.includes(m.type)}
                onSelect={() => toggleMember(m.type)}
              />
            ))}
          </div>
        </>
      )}

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
}
