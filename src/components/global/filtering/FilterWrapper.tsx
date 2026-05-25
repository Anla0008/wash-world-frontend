//Få denne komponent til at snakke sammen med databasen og singleview, så den kan filtrere på det der rent faktisk er i databasen
// og ikke bare være en dummy med 5 antal vaskehaller.

"use client";

import { useEffect, useRef, useState } from "react";
import Filter from "../icons/navigation/Filter";
import FilterCard from "./FilterCard";
import { useLocationFilterStore } from "@/stores/useLocationFilterStore";

type FilterWrapperProps = {
  maxWashHallNumber: number;
  washHallNumbers: number[];
  minSelfWashNumber: number;
  maxSelfWashNumber: number;
  selfWashNumbers: number[];
};

const FilterWrapper = ({ maxWashHallNumber, washHallNumbers, minSelfWashNumber, maxSelfWashNumber, selfWashNumbers }: FilterWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const washHallRange = useLocationFilterStore((state) => state.washHallRange);
  const setWashHallRange = useLocationFilterStore((state) => state.setWashHallRange);

  const selfWashRange = useLocationFilterStore((state) => state.selfWashRange);
  const setSelfWashRange = useLocationFilterStore((state) => state.setSelfWashRange);

  const selectedFacilities = useLocationFilterStore((state) => state.selectedFacilities);
  const toggleFacility = useLocationFilterStore((state) => state.toggleFacility);

  const resetFilters = useLocationFilterStore((state) => state.resetFilters);

  useEffect(() => {
    setWashHallRange((prev) => ({
      ...prev,
      max: maxWashHallNumber,
    }));

    setSelfWashRange(() => ({
      min: minSelfWashNumber,
      max: maxSelfWashNumber,
    }));
  }, [maxWashHallNumber, minSelfWashNumber, maxSelfWashNumber, setWashHallRange, setSelfWashRange]);

  const hasFiltered = selectedFacilities.length > 0 || washHallRange.min !== 1 || washHallRange.max !== maxWashHallNumber || selfWashRange.min !== minSelfWashNumber || selfWashRange.max !== maxSelfWashNumber;
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;

      if (!target || !containerRef.current) return;

      if (!containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      <div>
        <button type="button" className="flex flex-col cursor-pointer items-center gap-1" onClick={() => setIsOpen(true)}>
          <Filter />
          <span>Filtrér</span>
        </button>

        {/* {hasFiltered ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              resetFilters(maxWashHallNumber, minSelfWashNumber, maxSelfWashNumber);
            }}
            className="text-sm font-bold"
          >
            Nulstil
          </button>
        ) : null} */}
      </div>

      {isOpen ? <FilterCard chosen={selectedFacilities} onToggle={toggleFacility} setIsOpen={setIsOpen} washHallRange={washHallRange} setWashHallRange={setWashHallRange} washHallNumbers={washHallNumbers} maxWashHallNumber={maxWashHallNumber} selfWashRange={selfWashRange} setSelfWashRange={setSelfWashRange} selfWashNumbers={selfWashNumbers} maxSelfWashNumber={maxSelfWashNumber} /> : null}
    </div>
  );
};

export default FilterWrapper;
