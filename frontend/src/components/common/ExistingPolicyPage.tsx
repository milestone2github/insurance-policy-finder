// src/pages/ExistingPoliciesPage.tsx

import React, { useState, useEffect } from 'react';
import InsurancePolicyForm, {
  type InsurancePolicyData,
} from '../shared/InsaurancePolicyForm';
import SmallButton from '../shared/SmallButton';
import type { SelectOption } from '../types';
import OptionCard from '../shared/OptionCard';

interface ExistingPoliciesPageProps {
  planCount: number;
  policyOptions: SelectOption[];
  memberOptions: SelectOption[];
  onPrev: () => void;
  onReview: (allData: InsurancePolicyData[]) => void;
}

export default function ExistingPoliciesPage({
  planCount,
  policyOptions,
  memberOptions,
  onPrev,
  onReview,
}: ExistingPoliciesPageProps) {
  const [forms, setForms] = useState<InsurancePolicyData[]>([]);

  // initialize `forms` array whenever planCount changes
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

  // update one form’s data
  const handleChange = (idx: number) => (data: InsurancePolicyData) => {
    setForms((prev) => {
      const next = [...prev];
      next[idx] = data;
      return next;
    });
  };

  // form validation
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

      {forms.map((data, idx) => (
        <div
          key={idx}
          className="
            bg-white
            border border-gray-200
            rounded-lg
            shadow-sm
            p-6
            overflow-hidden
          "
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Policy {idx + 1}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {/* Plan dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name of insurance plan*
                </label>
                <select
                  className="
                    block w-full px-3 py-2
                    border border-gray-300
                    rounded-md
                    focus:outline-none focus:ring-2 focus:ring-green-400
                  "
                  value={data.plan}
                  onChange={(e) =>
                    handleChange(idx)({ ...data, plan: e.target.value })
                  }
                >
                  <option value="">Select Plan</option>
                  {policyOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other plan name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Other Plan name*
                </label>
                <input
                  type="text"
                  className="
                    block w-full px-3 py-2
                    border border-gray-300
                    rounded-md
                    focus:outline-none focus:ring-2 focus:ring-green-400
                  "
                  placeholder="Other Plan name?"
                  value={data.otherPlanName}
                  onChange={(e) =>
                    handleChange(idx)({
                      ...data,
                      otherPlanName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Type of policy */}
              <div>
                <span className="block text-sm font-medium mb-1">
                  Type of policy*
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {(['individual', 'floater'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        handleChange(idx)({ ...data, policyType: type })
                      }
                      className={`
                        px-4 py-2 text-sm font-medium
                        rounded-md
                        transition
                        ${data.policyType === type
                          ? 'border-2 border-green-500 bg-green-50 text-green-700'
                          : 'border border-gray-300 hover:bg-gray-100'
                        }
                      `}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Cover amount */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cover amount*
                </label>
                <input
                  type="text"
                  className="
                    block w-full px-3 py-2
                    border border-gray-300
                    rounded-md
                    focus:outline-none focus:ring-2 focus:ring-green-400
                  "
                  placeholder="Enter in Lakhs"
                  value={data.coverAmount}
                  onChange={(e) =>
                    handleChange(idx)({ ...data, coverAmount: e.target.value })
                  }
                />
              </div>

              {/* Renewal date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Policy Renewal Date*
                </label>
                <input
                  type="date"
                  className="
                    block w-full px-3 py-2
                    border border-gray-300
                    rounded-md
                    focus:outline-none focus:ring-2 focus:ring-green-400
                  "
                  value={data.renewalDate}
                  onChange={(e) =>
                    handleChange(idx)({
                      ...data,
                      renewalDate: e.target.value,
                    })
                  }
                />
              </div>

              {/* Members covered */}
              <div className={data.policyType === 'floater' ? 'md:col-span-2' : ''}>
                <span className="block text-sm font-medium mb-1">
                  {data.policyType === 'floater'
                    ? 'Members covered*'
                    : 'Member covered*'}
                </span>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {memberOptions.map((o) => {
                    const isSelected = data.policyType === 'floater'
                      ? data.membersCovered.includes(o.value)
                      : data.memberCovered === o.value;

                    return (
                      <OptionCard
                        key={o.value}
                        label={o.label}
                        selected={isSelected}
                        onClick={() => {
                          if (data.policyType === 'floater') {
                            const next = isSelected
                              ? data.membersCovered.filter((x) => x !== o.value)
                              : [...data.membersCovered, o.value];
                            handleChange(idx)({ ...data, membersCovered: next });
                          } else {
                            handleChange(idx)({ ...data, memberCovered: o.value });
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <div className="flex justify-between">
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
}
