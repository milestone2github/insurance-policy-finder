import React from "react";
import SelfIcon from "../../assets/icons/SelfIcon.png"
import SpouseIcon from "../../assets/icons/SpouseIcon.png"
import FatherIcon from "../../assets/icons/FatherIcon.png"
import MotherIcon from "../../assets/icons/MotherIcon.png"
import SonIcon from "../../assets/icons/SonIcon.png"
import DaughterIcon from "../../assets/icons/DaughterIcon.png"

type ProfileType = "self" | "spouse" | "son" | "daughter" | "father" | "mother";


interface ProfileButtonProps {
  profileType: ProfileType;
  label: string;
  selected: boolean;
  count?: number;
  onSelect: () => void;
  onCountChange?: (delta: number) => void;
}

const iconMap: Record<ProfileType, string> = {
  self: SelfIcon,
  spouse: SpouseIcon,
  son: SonIcon,
  daughter: DaughterIcon,
  father: FatherIcon,
  mother: MotherIcon,
};

const ProfileButton: React.FC<ProfileButtonProps> = ({
  profileType,
  label,
  selected,
  count = 0,
  onSelect,
  onCountChange,
}) => {
  const isCountable = profileType === "son" || profileType === "daughter";
  const iconSrc = iconMap[profileType];

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer text-center w-32 h-44 flex flex-col items-center justify-between ${
        selected ? "border-green-500 bg-green-50" : "border-gray-300"
      }`}
      onClick={onSelect}
    >
      <img src={iconSrc} alt={label} className="h-16 w-16 rounded-full" />
      <div className="font-semibold mt-2">{label}</div>

      {isCountable && (
        <div
          className="flex justify-center items-center mt-2 space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="px-2 bg-gray-200 rounded-full"
            onClick={() => onCountChange?.(-1)}
            disabled={count <= 0}
          >
            -
          </button>
          <span>{count}</span>
          <button
            className="px-2 bg-gray-200 rounded-full"
            onClick={() => onCountChange?.(1)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;