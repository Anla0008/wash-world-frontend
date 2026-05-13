"use client";
import { HiOutlineArrowLongUp } from "react-icons/hi2";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";

import { useState } from "react";
import { SortDirection, SortingProps } from "@/types/filtering";

const Sorting = ({
  label = "Sortér",
  direction,
  defaultDirection = "desc",
  onDirectionChange,
  className,
}: SortingProps) => {
  // intern state til hvis komponenten bruges uden prop
  const [internalDirection, setInternalDirection] =
    useState<SortDirection>(defaultDirection);

  // hvis der er en direction prop, så brug den, ellers brug den interne state, så vi kan håndtere både kontrolleret og ukontrolleret brug
  const currentDirection = direction ?? internalDirection;

  // så brugeren kan skifte retning
  const handleToggle = () => {
    const nextDirection: SortDirection =
      currentDirection === "desc" ? "asc" : "desc";

    // hvis ingen retning er valgt, så opdater den interne retning, så ikonerne opdateres
    if (direction === undefined) {
      setInternalDirection(nextDirection);
    }

    onDirectionChange?.(nextDirection);
  };

  // starter ved ikke at være sorteret derfra ascending så ventetiden vises med laveste interval og op, og derfra ascending

  return (
    <button
      type="button"
      aria-label={`${label} (${currentDirection === "asc" ? "stigende" : "faldende"})`}
      className={`flex flex-col items-center cursor-pointer ${className ?? ""}`.trim()}
      onClick={handleToggle}
    >
      <div className="flex relative">
        {currentDirection === "asc" ? (
          <>
            <HiOutlineArrowLongUp
              className="absolute -left-5.5 -top-8"
              color="foreground"
              size={30}
            />
            <HiOutlineArrowNarrowDown
              className="absolute -left-1.5 -top-8"
              color="foreground"
              size={30}
            />
          </>
        ) : (
          <>
            <HiOutlineArrowNarrowDown
              className="absolute -left-5.5 -top-8"
              color="foreground"
              size={30}
            />
            <HiOutlineArrowLongUp
              className="absolute -left-1.5 -top-8"
              color="foreground"
              size={30}
            />
          </>
        )}
      </div>
      <span>{label}</span>
    </button>
  );
};

export default Sorting;
