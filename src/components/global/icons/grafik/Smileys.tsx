"use client";
import { PiSmileyAngryLight } from "react-icons/pi";
import { PiSmileySadLight } from "react-icons/pi";
import { PiSmileyBlankLight } from "react-icons/pi";
import { PiSmileyLight } from "react-icons/pi";
import { IoHappyOutline } from "react-icons/io5";
import { useState } from "react";

const Smileys = ({ onSelect }: { onSelect: (rating: number) => void }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const toggleSmileys = (smiley: string, rating: number) => {
    setSelected((prev) => (prev === smiley ? null : smiley));
    onSelect(rating);
  };

  return (
    <ul className="flex gap-5 mt-4 mb-14">
      <li>
        <IoHappyOutline color={selected === "happy" ? "green" : "var(--foreground)"} onClick={() => toggleSmileys("happy", 1)} size={50} />
      </li>
      <li>
        <PiSmileyLight color={selected === "smiley" ? "var(--brand-green)" : "var(--foreground)"} onClick={() => toggleSmileys("smiley", 2)} size={50} />
      </li>
      <li>
        <PiSmileyBlankLight color={selected === "blank" ? "yellow" : "var(--foreground)"} onClick={() => toggleSmileys("blank", 3)} size={50} />
      </li>
      <li>
        <PiSmileySadLight color={selected === "sad" ? "orange" : "var(--foreground)"} onClick={() => toggleSmileys("sad", 4)} size={50} />
      </li>
      <li>
        <PiSmileyAngryLight color={selected === "angry" ? "red" : "var(--foreground)"} onClick={() => toggleSmileys("angry", 5)} size={50} />
      </li>
    </ul>
  );
};

export default Smileys;
