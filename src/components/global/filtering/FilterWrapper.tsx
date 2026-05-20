// "use client";
// import { useEffect, useRef, useState } from "react";
// import Filter from "../icons/navigation/Filter";
// import FilterCard from "./FilterCard";

// const FilterWrapper = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [washHallRange, setWashHallRange] = useState({
//     min: 1, //opdater senere til backenden fra singleview
//     max: 5,
//   });

//   useEffect(() => {
//     if (!isOpen) return;
//     // lukker filter kun når brugeren klikker udenfor, ikke når de klikker inde i filteret
//     const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
//       const target = event.target as Node | null;
//       // hvis der ikke er et target eller containerRef, returneres der tidligt
//       if (!target || !containerRef.current) return;
//       // tjekker om det klikkede element er udenfor filteret
//       if (!containerRef.current.contains(target)) {
//         setIsOpen(false);
//       }
//     };
//     // tilføjer event listeners til at lytte efter klik
//     document.addEventListener("click", handleOutsideClick);

//     return () => {
//       document.removeEventListener("click", handleOutsideClick);
//     };
//   }, [isOpen]);

//   const [chosen, setChosen] = useState<string[]>([]);
//   // bestemmer om nulstil knappen skal vises altefter om der er filtreret eller progressbaren er anvendt
//   const hasFiltered =
//     chosen.length > 0 || washHallRange.min !== 1 || washHallRange.max !== 5; // opdater senere til backenden fra singleview

//   // toggleOption håndterer tilføjelse og fjernelse af filtermuligheder i chosen-arrayet
//   const toggleOption = (option: string) => {
//     setChosen(
//       (prev) =>
//         prev.includes(option)
//           ? prev.filter((item) => item !== option) // fjerner option ved at filtrere det ud af arrayet
//           : [...prev, option], // tilføjer option ved at oprette et nyt array med den nye option inkluderet
//     );
//   };

//   return (
//     <div ref={containerRef} className="relative flex flex-col m-auto gap-2">
//       <div
//         className="flex items-center gap-2 cursor-pointer m-auto"
//         onClick={() => setIsOpen(true)}
//       >
//         <Filter />
//         <span>Filtrér</span>
//         {hasFiltered ? (
//           <button
//             onClick={(e) => {
//               e.stopPropagation(); // forhindrer at klik på "Nulstil" også åbner filteret
//               setChosen([]);
//             }}
//             className="text-xs extra-bold"
//           >
//             Nulstil
//           </button>
//         ) : null}
//       </div>

//       {isOpen ? (
//         <FilterCard
//           chosen={chosen}
//           onToggle={toggleOption}
//           setIsOpen={setIsOpen}
//           washHallRange={washHallRange}
//           setWashHallRange={setWashHallRange}
//         />
//       ) : null}
//     </div>
//   );
// };

// export default FilterWrapper;

///////////////////////////////////

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
    <div ref={containerRef} className="relative flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <button type="button" className="flex cursor-pointer items-center gap-2" onClick={() => setIsOpen(true)}>
          <Filter />
          <span>Filtrér</span>
        </button>

        {hasFiltered ? (
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
        ) : null}
      </div>

      {isOpen ? <FilterCard chosen={selectedFacilities} onToggle={toggleFacility} setIsOpen={setIsOpen} washHallRange={washHallRange} setWashHallRange={setWashHallRange} washHallNumbers={washHallNumbers} maxWashHallNumber={maxWashHallNumber} selfWashRange={selfWashRange} setSelfWashRange={setSelfWashRange} selfWashNumbers={selfWashNumbers} maxSelfWashNumber={maxSelfWashNumber} /> : null}
    </div>
  );
};

export default FilterWrapper;
