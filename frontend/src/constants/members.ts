import SelfIcon from "../assets/icons/SelfIcon.png";
import SpouseIcon from "../assets/icons/SpouseIcon.png";
import FatherIcon from "../assets/icons/FatherIcon.png";
import MotherIcon from "../assets/icons/MotherIcon.png";
import SonIcon from "../assets/icons/SonIcon.png";
import DaughterIcon from "../assets/icons/DaughterIcon.png";
import type { Member } from "../components/common/MadicalReview";

export const ALL_MEMBERS: Member[] = [
  { type: "self",     label: "You",     age: undefined, avatarUrl: SelfIcon },
  { type: "spouse",   label: "Spouse",  age: undefined, avatarUrl: SpouseIcon },
  { type: "father",   label: "Father",  age: 55,        avatarUrl: FatherIcon },
  { type: "mother",   label: "Mother",  age: undefined, avatarUrl: MotherIcon },
  { type: "son",      label: "Son",     age: undefined, avatarUrl: SonIcon },
  { type: "daughter", label: "Daughter",age: undefined, avatarUrl: DaughterIcon },
];
