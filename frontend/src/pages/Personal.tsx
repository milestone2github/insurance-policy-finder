import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ProfileButton from "../components/shared/ProfileButton";

const defaultProfiles = [
  { profileType: "self",   label: "Myself", countable: false },
  { profileType: "spouse", label: "Spouse", countable: false },
  { profileType: "son",    label: "Son",    countable: true },
  { profileType: "daughter", label: "Daughter", countable: true },
  { profileType: "father", label: "Father", countable: false },
  { profileType: "mother", label: "Mother", countable: false },
] as const;


const Personal: React.FC = () => {
  const [selection, setSelection] = useState<Record<string, { selected: boolean; count?: number }>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("profileSelection");
    if (saved) setSelection(JSON.parse(saved));
  }, []);

  const toggleSelect = (key: string, countable: boolean) => {   
    setSelection((prev) => {
      const current = prev[key] || { selected: false, count: 0 };
      return {
        ...prev,
        [key]: {
          selected: !current.selected,
          count: countable ? current.count || 0 : undefined,
        },
      };
    });
  };

  const handleCountChange = (key: string, delta: number) => {
    setSelection((prev) => {
      const current = prev[key] || { selected: true, count: 0 };
      const updatedCount = Math.max(0, (current.count || 0) + delta);
      return {
        ...prev,
        [key]: { ...current, selected: true, count: updatedCount },
      };
    });
  };

  const handleNext = () => {
    localStorage.setItem("profileSelection", JSON.stringify(selection));
    navigate("/enter-names");
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-2">Let’s start. Tell us who you’d like to cover!</h2>
      <p className="mb-6">Please provide us with the following details.</p>
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {defaultProfiles.map((profile) => (
          <ProfileButton
            key={profile.profileType}
            profileType={profile.profileType}
            label={profile.label}
            selected={selection[profile.profileType]?.selected || false}
            count={profile.countable ? selection[profile.profileType]?.count || 0 : undefined}
            onSelect={() => toggleSelect(profile.profileType, profile.countable)}
            onCountChange={
              profile.countable
                ? (delta) => handleCountChange(profile.profileType, delta)
                : undefined
            }
          />
        ))}
      </div>
      <button onClick={handleNext} className="bg-green-500 text-white px-6 py-2 rounded">
        Next
      </button>
    </div>
  );
};

export default Personal;
