"use client";
import { PiSmileyAngryLight } from "react-icons/pi";
import { PiSmileySadLight } from "react-icons/pi";
import { PiSmileyBlankLight } from "react-icons/pi";
import { PiSmileyLight } from "react-icons/pi";
import { IoHappyOutline } from "react-icons/io5";
import { useState } from "react";


const Smileys = () => {
   const [selected, setSelected] = useState<string | null>(null);

    const toggleSmileys = (smiley: string) => {
       setSelected((prev) => (prev === smiley ? null : smiley));
    }

    return (
        <ul className="flex gap-5">
            <li><IoHappyOutline color={selected === "happy" ? "green" : "var(--foreground)"} onClick={() => toggleSmileys("happy")} size={50}/></li>
            <li><PiSmileyLight color={selected === "smiley" ? "var(--brand-green)" : "var(--foreground)"} onClick={() => toggleSmileys("smiley")} size={50}/></li>
            <li><PiSmileyBlankLight color={selected === "blank" ? "yellow" : "var(--foreground)"} onClick={() => toggleSmileys("blank")} size={50}/></li>
            <li><PiSmileySadLight color={selected === "sad" ? "orange" : "var(--foreground)"} onClick={() => toggleSmileys("sad")} size={50}/></li>
            <li><PiSmileyAngryLight color={selected === "angry" ? "red" : "var(--foreground)"} onClick={() => toggleSmileys("angry")} size={50}/></li>
        </ul>
      );
}
 
export default Smileys;