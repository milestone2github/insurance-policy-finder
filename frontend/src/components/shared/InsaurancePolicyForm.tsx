// src/components/shared/InsurancePolicyForm.tsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import OptionCard from './OptionCard';
import type { SelectOption } from '@/types';

export interface InsurancePolicyData {
  plan: string;
  otherPlanName: string;
  coverAmount: string;
  renewalDate: string;
  policyType: 'individual' | 'floater' | '';
  memberCovered: string;        // for individual
  membersCovered: string[];     // for floater
}

interface InsurancePolicyFormProps {
  index: number;
  policyOptions: SelectOption[];
  memberOptions: SelectOption[];
  initialData?: Partial<InsurancePolicyData>;
  onChange?: (data: InsurancePolicyData) => void;
}

const InsurancePolicyForm: React.FC<InsurancePolicyFormProps> = ({
  index,
  policyOptions,
  memberOptions,
  initialData = {},
  onChange,
}) => {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState<InsurancePolicyData>({
    plan: '',
    otherPlanName: '',
    coverAmount: '',
    renewalDate: '',
    policyType: '',
    memberCovered: '',
    membersCovered: [],
    ...initialData,
  });

  const update = (patch: Partial<InsurancePolicyData>) => {
    const next = { ...data, ...patch };
    setData(next);
    onChange?.(next);
  };

  const toggleFloaterMember = (value: string) => {
    const already = data.membersCovered.includes(value);
    const nextList = already
      ? data.membersCovered.filter((v) => v !== value)
      : [...data.membersCovered, value];
    update({ membersCovered: nextList });
  };

  const canNext =
    !!data.plan &&
    !!data.coverAmount &&
    !!data.renewalDate &&
    data.policyType &&
    (
      data.policyType === 'individual'
        ? !!data.memberCovered
        : data.membersCovered.length > 0
    );

  return (
    <div className="border rounded-lg mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
      >
        <span className="font-medium">Policy {index}</span>
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>

      {open && (
        <div className="p-6 space-y-6 bg-white">
          {/* First row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Plan */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Name of insurance plan*
              </label>
              <select
                value={data.plan}
                onChange={(e) => update({ plan: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              >
                <option value="">Select Plan</option>
                {policyOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover amount */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Cover amount*
              </label>
              <input
                type="number"
                placeholder="Enter in Lakhs"
                value={data.coverAmount}
                onChange={(e) => update({ coverAmount: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
          </div>

          {/* Second row */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Other Plan name*
              </label>
              <input
                type="text"
                placeholder="Other Plan name?"
                value={data.otherPlanName}
                onChange={(e) => update({ otherPlanName: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Policy Renewal Date*
              </label>
              <input
                type="date"
                value={data.renewalDate}
                onChange={(e) => update({ renewalDate: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              />
            </div>
          </div>

          {/* Third row: policy type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Type of policy*
            </label>
            <div className="flex gap-4">
              {(['individual', 'floater'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    update({ policyType: t, memberCovered: '', membersCovered: [] })
                  }
                  className={`flex-1 text-center py-2 rounded ${
                    data.policyType === t
                      ? 'border-2 border-green-500 bg-green-50 text-green-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Fourth row: either single dropdown or multi-select buttons */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {data.policyType === 'floater'
                ? 'Who all are covered?*'
                : 'Members covered*'}
            </label>

            {data.policyType === 'floater' ? (
              <div className="flex gap-4">
                {memberOptions.map((m) => (
                  <OptionCard
                    key={m.value}
                    label={m.label}
                    selected={data.membersCovered.includes(m.value)}
                    onClick={() => toggleFloaterMember(m.value)}
                  />
                ))}
              </div>
            ) : (
              <select
                value={data.memberCovered}
                onChange={(e) => update({ memberCovered: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              >
                <option value="">Select member</option>
                {memberOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Next/Previous for this form if you want them here:
              otherwise your parent can handle navigation */}
        </div>
      )}

      {/* (Optional) you can include navigation buttons here */}
    </div>
  );
};

export default InsurancePolicyForm;
