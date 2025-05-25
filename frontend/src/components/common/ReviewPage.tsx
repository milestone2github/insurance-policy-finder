import React from 'react';
import type { ProfileType } from './MadicalReview';
import type { InsurancePolicyData } from '../shared/InsaurancePolicyForm';

interface ReviewPageProps {
  // 1. Personal details
  personal: {
    name: string;
    gender: string;
    dob: string;
  }[];
  // 2. Lifestyle
  lifestyle: {
    name: string;
    fitness: string;
    alcohol: string;
    tobacco: string;
  }[];
  // 3. Medical
  medical: {
    name: string;
    hasHistory: boolean;
    findings: string[];
    hospitalized: boolean;
  }[];
  // 4. Existing policies
  policies: InsurancePolicyData[];
  onEditSection: (section: 1 | 2 | 3 | 4) => void;
  onConfirm: () => void;
}

export default function ReviewPage({
  personal,
  lifestyle,
  medical,
  policies,
  onEditSection,
  onConfirm,
}: ReviewPageProps) {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-10">
      <h1 className="text-3xl font-semibold text-center mb-2">Review your details</h1>
      <p className="text-sm text-center text-gray-600 mb-8">
        Please confirm the accuracy of the details below. No changes can be made after form submission.
      </p>

      {/* Section 1 */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-green-600">1. Personal Details</h2>
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => onEditSection(1)}
          >
            Edit
          </button>
        </div>
        <p className="text-sm mb-2">
          <span className="font-medium">Members covered:</span>{' '}
          {personal.map((p) => p.name).join(', ')}
        </p>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Dob</th>
            </tr>
          </thead>
          <tbody>
            {personal.map((p) => (
              <tr key={p.name} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.gender}</td>
                <td className="p-2">{p.dob}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 2 */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-green-600">2. Lifestyle Details</h2>
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => onEditSection(2)}
          >
            Edit
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Fitness</th>
              <th className="p-2">Consumes alcohol</th>
              <th className="p-2">Consumes tobacco</th>
            </tr>
          </thead>
          <tbody>
            {lifestyle.map((l) => (
              <tr key={l.name} className="border-t">
                <td className="p-2">{l.name}</td>
                <td className="p-2">{l.fitness}</td>
                <td className="p-2">{l.alcohol}</td>
                <td className="p-2">{l.tobacco}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 3 */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-green-600">3. Medical/Health Details</h2>
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => onEditSection(3)}
          >
            Edit
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Medical history</th>
              <th className="p-2">Hospitalized</th>
            </tr>
          </thead>
          <tbody>
            {medical.map((m) => (
              <tr key={m.name} className="border-t">
                <td className="p-2">{m.name}</td>
                <td className="p-2">
                  {m.hasHistory ? m.findings.join(', ') : 'No'}
                </td>
                <td className="p-2">{m.hospitalized ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 4 */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-green-600">4. Existing Policy Details</h2>
          <button
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => onEditSection(4)}
          >
            Edit
          </button>
        </div>
        {policies.map((p, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-medium mb-2">Policy {i + 1}</h3>
            <ul className="space-y-1 text-sm">
              <li><span className="font-medium">Plan:</span> {p.plan}</li>
              <li><span className="font-medium">Other Plan Name:</span> {p.otherPlanName}</li>
              <li><span className="font-medium">Cover Amount:</span> {p.coverAmount}</li>
              <li><span className="font-medium">Renewal Date:</span> {p.renewalDate}</li>
              <li><span className="font-medium">Type:</span> {p.policyType}</li>
              {p.policyType === 'floater' ? (
                <li>
                  <span className="font-medium">Members covered:</span>{' '}
                  {p.membersCovered.join(', ')}
                </li>
              ) : (
                <li>
                  <span className="font-medium">Member covered:</span> {p.memberCovered}
                </li>
              )}
            </ul>
          </div>
        ))}
      </section>

      <div className="text-center">
        <button
          onClick={onConfirm}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Confirm and Generate Report
        </button>
      </div>
    </div>
);
}
