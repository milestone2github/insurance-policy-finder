import React, { useState } from 'react';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import InfoRow from '../shared/InfoAvtar';
import SmallButton from '../shared/SmallButton';
import type { ProfileType, Member } from './MadicalReview'; 
// reuse your Member & ProfileType definitions

// define the shape of each dropdown option
interface Option {
  label: string;
  value: string;
}

const ADVERSE_OPTIONS: Option[] = [
  { label: 'ACL tear',        value: 'acl_tear' },
  { label: 'Hypertension',    value: 'hypertension' },
  { label: 'Diabetes',        value: 'diabetes' },
  { label: 'High cholesterol',value: 'high_cholesterol' },
  // …add as many as you need
];

interface AdverseDetailsProps {
  members: Member[];
  onPrev: () => void;
  onNext: (answers: Record<ProfileType, Option[]>) => void;
}

const AdverseDetails: React.FC<AdverseDetailsProps> = ({
  members,
  onPrev,
  onNext,
}) => {
  // track each member's selected options
  const [selections, setSelections] =
    useState<Record<ProfileType, Option[]>>({} as any);

  const handleChange =
    (type: ProfileType) =>
    (opts: MultiValue<Option>) => {
      setSelections((prev) => ({
        ...prev,
        [type]: opts as Option[],
      }));
    };

  const clearAll = (type: ProfileType) => {
    setSelections((prev) => ({
      ...prev,
      [type]: [],
    }));
  };

  // only enable Next if every member has >=1 finding
  const allDone = members.every(
    (m) => selections[m.type] && selections[m.type].length > 0
  );

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <h1 className="text-2xl font-bold text-center">
        Please tell us more about the adverse finding(s).
      </h1>

      {members.map((m) => (
        <div
          key={m.type}
          className="flex items-center bg-white rounded-lg shadow p-4"
        >
          <div className="w-40">
            <InfoRow
              avatarUrl={m.avatarUrl}
              name={
                m.age
                  ? `${m.label} (${m.age} yrs)`
                  : m.label
              }
            />
          </div>

          <div className="flex-1">
            <Select
              isMulti
              options={ADVERSE_OPTIONS}
              value={selections[m.type] || []}
              onChange={handleChange(m.type)}
              placeholder="Select finding(s)…"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <button
            onClick={() => clearAll(m.type)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            Clear All ×
          </button>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <SmallButton variant="outline" onClick={onPrev}>
          Previous
        </SmallButton>
        <SmallButton
          variant={allDone ? 'solid' : 'outline'}
          onClick={() => onNext(selections)}
          disabled={!allDone}
          className={!allDone ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Next
        </SmallButton>
      </div>
    </div>
  );
};

export default AdverseDetails;


