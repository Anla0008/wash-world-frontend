"use client";
import { HiOutlineArrowLongUp } from "react-icons/hi2";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";

import { useState } from "react";
import { SortDirection, SortingProps } from "@/types/filtering";

const Sorting = ({ label = "Sortér", direction, defaultDirection = "desc", onDirectionChange, className }: SortingProps) => {
  // intern state til hvis komponenten bruges uden prop
  const [internalDirection, setInternalDirection] = useState<SortDirection>(defaultDirection);

  // hvis der er en direction prop, så brug den, ellers brug den interne state, så vi kan håndtere både kontrolleret og ukontrolleret brug
  const currentDirection = direction ?? internalDirection;

  // så brugeren kan skifte retning
  const handleToggle = () => {
    const nextDirection: SortDirection = currentDirection === "desc" ? "asc" : "desc";

    // hvis ingen retning er valgt, så opdater den interne retning, så ikonerne opdateres
    if (direction === undefined) {
      setInternalDirection(nextDirection);
    }

    onDirectionChange?.(nextDirection);
  };

  // starter ved ikke at være sorteret derfra ascending så ventetiden vises med laveste interval og op, og derfra ascending

  return (
    <button type="button" aria-label={`${label} (${currentDirection === "asc" ? "stigende" : "faldende"})`} className={`gap-1 flex flex-col items-center cursor-pointer ${className ?? ""}`.trim()} onClick={handleToggle}>
      <div className="flex">
        {currentDirection === "asc" ? (
          <>
            <HiOutlineArrowLongUp size={16} />
            <HiOutlineArrowNarrowDown size={16} />
          </>
        ) : (
          <>
            <HiOutlineArrowNarrowDown size={16} />
            <HiOutlineArrowLongUp size={16} />
          </>
        )}
      </div>
      <span className="text-md">{label}</span>
    </button>
  );
};

export default Sorting;
