// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Location } from "@/types/locations";
// import VaskehalCard from "@/components/global/cards/VaskehalCard";
// import SearchBar from "../global/filtering/SearchBar";
// import FilterWrapper from "../global/filtering/FilterWrapper";
// import Sorting from "../global/filtering/Sorting";
// import { useLocationFilterStore } from "@/stores/useLocationFilterStore";

// type FindVaskehalBottomSheetProps = {
//   locations: Location[];
//   selectedLocationPk: string | null;
//   favoriteIds: string[];
// };

// // Højder i procent af skærmen
// const MIN_HEIGHT = 35;
// const MID_HEIGHT = 60;
// const MAX_HEIGHT = 85;

// export default function FindVaskehalBottomSheet({ locations, selectedLocationPk, favoriteIds }: FindVaskehalBottomSheetProps) {
//   const [height, setHeight] = useState(MID_HEIGHT);
//   const [isDragging, setIsDragging] = useState(false);

//   const startY = useRef(0);
//   const startHeight = useRef(MID_HEIGHT);

//   // Her gemmer vi en reference til hvert card ud fra location_pk.
//   const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // Filter state fra Zustand
//   const searchTerm = useLocationFilterStore((state) => state.searchTerm);
//   const washHallRange = useLocationFilterStore((state) => state.washHallRange);
//   const selfWashRange = useLocationFilterStore((state) => state.selfWashRange);
//   const selectedFacilities = useLocationFilterStore((state) => state.selectedFacilities);

//   // Finder de forskellige antal vaskehaller, der faktisk findes i databasen
//   const washHallNumbers = Array.from(new Set(locations.map((location) => location.car_wash_hall_number).filter((number): number is number => number !== undefined))).sort((a, b) => a - b);

//   // Finder de forskellige antal "vask selv", der faktisk findes i databasen
//   const selfWashNumbers = Array.from(new Set(locations.map((location) => location.car_wash_self).filter((number): number is number => number !== undefined))).sort((a, b) => a - b);

//   // Finder max værdierne ud fra databasen
//   const maxWashHallNumber = washHallNumbers.at(-1) ?? 1;
//   const maxSelfWashNumber = selfWashNumbers.at(-1) ?? 1;

//   const filteredLocations = locations.filter((location) => {
//     const searchValue = searchTerm.toLowerCase().trim();

//     const city = location.location_city.toLowerCase();
//     const address = location.location_address.toLowerCase();

//     const matchesSearch = city.includes(searchValue) || address.includes(searchValue);

//     const washHallNumber = location.car_wash_hall_number;

//     const matchesWashHallRange = washHallNumber !== undefined && washHallNumber >= washHallRange.min && washHallNumber <= washHallRange.max;

//     const selfWashNumber = location.car_wash_self;

//     const matchesSelfWashRange = selfWashNumber !== undefined && selfWashNumber >= selfWashRange.min && selfWashNumber <= selfWashRange.max;

//     const matchesFacilities = selectedFacilities.every((facility) => {
//       if (facility === "Højtryksforvask") {
//         return Number(location.car_wash_high_pressure) > 0;
//       }

//       if (facility === "Støvsuger") {
//         return Number(location.car_wash_vacuum) > 0;
//       }

//       if (facility === "Vask selv") {
//         return Number(location.car_wash_self) > 0;
//       }

//       return true;
//     });

//     return matchesSearch && matchesWashHallRange && matchesSelfWashRange && matchesFacilities;
//   });

//   useEffect(() => {
//     if (!selectedLocationPk) return;

//     const selectedCard = cardRefs.current[selectedLocationPk];

//     if (!selectedCard) return;

//     // Åbner bottom sheet lidt mere, så brugeren tydeligt kan se det valgte card.
//     setHeight(MAX_HEIGHT);

//     // Lidt delay, så højden når at ændre sig før vi scroller til cardet.
//     setTimeout(() => {
//       selectedCard.scrollIntoView({
//         behavior: "smooth",
//         block: "center",
//       });
//     }, 300);
//   }, [selectedLocationPk]);

//   function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
//     setIsDragging(true);

//     startY.current = event.clientY;
//     startHeight.current = height;

//     event.currentTarget.setPointerCapture(event.pointerId);
//   }

//   function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
//     if (!isDragging) return;

//     const dragDistance = startY.current - event.clientY;
//     const screenHeight = window.innerHeight;
//     const dragPercent = (dragDistance / screenHeight) * 100;

//     const newHeight = startHeight.current + dragPercent;
//     const limitedHeight = Math.min(Math.max(newHeight, MIN_HEIGHT), MAX_HEIGHT);

//     setHeight(limitedHeight);
//   }

//   function handlePointerUp() {
//     setIsDragging(false);

//     if (height < 47) {
//       setHeight(MIN_HEIGHT);
//       return;
//     }

//     if (height < 72) {
//       setHeight(MID_HEIGHT);
//       return;
//     }

//     setHeight(MAX_HEIGHT);
//   }

//   return (
//     <section className={`fixed bottom-0 left-1/2 z-50 flex w-full max-w-107 -translate-x-1/2 flex-col rounded-t-3xl bg-background p-4 text-foreground shadow-2xl ${isDragging ? "" : "transition-all duration-300"}`} style={{ height: `${height}dvh` }}>
//       <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} className="mx-auto mb-4 flex h-8 w-full shrink-0 touch-none cursor-grab select-none items-center justify-center active:cursor-grabbing" role="button" aria-label="Træk bottom sheet op eller ned">
//         <span className="h-1 w-12 rounded-full bg-(--gray-60)" />
//       </div>

//       <div className="mb-4 shrink-0">
//         <h2 className="text-2xl font-medium">Vaskehaller</h2>
//         <p className="text-sm font-light text-(--gray-10)">Find en vaskehal tæt på dig</p>
//       </div>

//       <div className="mb-4 flex w-full shrink-0 flex-col gap-3">
//         <SearchBar />

//         <FilterWrapper maxWashHallNumber={maxWashHallNumber} washHallNumbers={washHallNumbers} maxSelfWashNumber={maxSelfWashNumber} selfWashNumbers={selfWashNumbers} />
//       </div>

//       <Sorting />

//       <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-28">
//         {filteredLocations.length > 0 ? (
//           filteredLocations.map((location) => {
//             const isSelected = selectedLocationPk === location.location_pk;

//             return (
//               <div
//                 key={location.location_pk}
//                 ref={(element) => {
//                   cardRefs.current[location.location_pk] = element;
//                 }}
//                 className={`rounded-md transition-all duration-300 ${isSelected ? "ring-4 ring-(--brand-green)" : ""}`}
//               >
//                 <CarWashCard city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href={`/locations/${location.location_pk}`} location_pk={location.location_pk} isFavorite={favoriteIds.includes(location.location_pk)} />
//               </div>
//             );
//           })
//         ) : (
//           <p className="pt-4 text-sm text-(--gray-10)">Ingen vaskehaller matcher dine filtre.</p>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { Location } from "@/types/locations";
import CarWashCard from "@/components/global/cards/CarWashCard";
import SearchBar from "../global/filtering/SearchBar";
import FilterWrapper from "../global/filtering/FilterWrapper";
import Sorting from "../global/filtering/Sorting";
import { useLocationFilterStore } from "@/stores/useLocationFilterStore";

type FindCarWashBottomSheetProps = {
  locations: Location[];
  selectedLocationPk: string | null;
  favoriteIds: string[];
};

type Range = {
  min: number;
  max: number;
};

// Højder i procent af skærmen
const MIN_HEIGHT = 35;
const MID_HEIGHT = 60;
const MAX_HEIGHT = 85;

// Hjælpefunktion: finder unikke tal fra databasen og sorterer dem
function getUniqueNumbers(numbers: Array<number | undefined>) {
  return Array.from(new Set(numbers.filter((number): number is number => number !== undefined))).sort((a, b) => a - b);
}

// Hjælpefunktion: tjekker om en værdi ligger indenfor et valgt interval
function matchesRange(value: number | undefined, range: Range) {
  return value !== undefined && value >= range.min && value <= range.max;
}

export default function FindCarWashBottomSheet({ locations, selectedLocationPk, favoriteIds }: FindCarWashBottomSheetProps) {
  const [height, setHeight] = useState(MID_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const startY = useRef(0);
  const startHeight = useRef(MID_HEIGHT);

  // Her gemmer vi en reference til hvert card ud fra location_pk.
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter state fra Zustand
  const searchTerm = useLocationFilterStore((state) => state.searchTerm);
  const washHallRange = useLocationFilterStore((state) => state.washHallRange);
  const selfWashRange = useLocationFilterStore((state) => state.selfWashRange);
  const selectedFacilities = useLocationFilterStore((state) => state.selectedFacilities);

  // Finder de tal, der faktisk findes i databasen
  const washHallNumbers = getUniqueNumbers(locations.map((location) => location.car_wash_hall_number));

  const selfWashNumbers = getUniqueNumbers(locations.map((location) => location.car_wash_self));

  // Finder min og max ud fra databasen
  const maxWashHallNumber = washHallNumbers.at(-1) ?? 1;

  const minSelfWashNumber = selfWashNumbers.at(0) ?? 0;
  const maxSelfWashNumber = selfWashNumbers.at(-1) ?? 0;

  const filteredLocations = locations.filter((location) => {
    const searchValue = searchTerm.toLowerCase().trim();

    const city = location.location_city.toLowerCase();
    const address = location.location_address.toLowerCase();

    const matchesSearch = city.includes(searchValue) || address.includes(searchValue);

    const matchesWashHallRange = matchesRange(location.car_wash_hall_number, washHallRange);

    const matchesSelfWashRange = matchesRange(location.car_wash_self, selfWashRange);

    const matchesFacilities = selectedFacilities.every((facility) => {
      if (facility === "Højtryksforvask") {
        return Number(location.car_wash_high_pressure) > 0;
      }

      if (facility === "Støvsuger") {
        return Number(location.car_wash_vacuum) > 0;
      }

      if (facility === "Vask selv") {
        return Number(location.car_wash_self) > 0;
      }

      return true;
    });

    return matchesSearch && matchesWashHallRange && matchesSelfWashRange && matchesFacilities;
  });

  useEffect(() => {
    if (!selectedLocationPk) return;

    const selectedCard = cardRefs.current[selectedLocationPk];

    if (!selectedCard) return;

    // Åbner bottom sheet lidt mere, så brugeren tydeligt kan se det valgte card.
    setHeight(MAX_HEIGHT);

    // Lidt delay, så højden når at ændre sig før vi scroller til cardet.
    setTimeout(() => {
      selectedCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  }, [selectedLocationPk]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);

    startY.current = event.clientY;
    startHeight.current = height;

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;

    const dragDistance = startY.current - event.clientY;
    const screenHeight = window.innerHeight;
    const dragPercent = (dragDistance / screenHeight) * 100;

    const newHeight = startHeight.current + dragPercent;
    const limitedHeight = Math.min(Math.max(newHeight, MIN_HEIGHT), MAX_HEIGHT);

    setHeight(limitedHeight);
  }

  function handlePointerUp() {
    setIsDragging(false);

    if (height < 47) {
      setHeight(MIN_HEIGHT);
      return;
    }

    if (height < 72) {
      setHeight(MID_HEIGHT);
      return;
    }

    setHeight(MAX_HEIGHT);
  }

  return (
    <section className={`fixed bottom-0 left-1/2 z-50 flex w-full max-w-107 -translate-x-1/2 flex-col rounded-t-3xl bg-background p-4 text-foreground shadow-2xl ${isDragging ? "" : "transition-all duration-300"}`} style={{ height: `${height}dvh` }}>
      <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} className="mx-auto mb-4 flex h-8 w-full shrink-0 touch-none cursor-grab select-none items-center justify-center active:cursor-grabbing" role="button" aria-label="Træk bottom sheet op eller ned">
        <span className="h-1 w-12 rounded-full bg-(--gray-60)" />
      </div>

      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-medium">Vaskehaller</h2>
        <p className="text-sm font-light text-(--gray-10)">Find en vaskehal tæt på dig</p>
      </div>

      <div className="mb-4 flex w-full shrink-0 flex-col gap-3">
        <SearchBar />

        <FilterWrapper maxWashHallNumber={maxWashHallNumber} washHallNumbers={washHallNumbers} minSelfWashNumber={minSelfWashNumber} maxSelfWashNumber={maxSelfWashNumber} selfWashNumbers={selfWashNumbers} />
      </div>

      <Sorting />

      <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-28">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => {
            const isSelected = selectedLocationPk === location.location_pk;

            return (
              <div
                key={location.location_pk}
                ref={(element) => {
                  cardRefs.current[location.location_pk] = element;
                }}
                className={`rounded-md transition-all duration-300 ${isSelected ? "ring-4 ring-(--brand-green)" : ""}`}
              >
                <CarWashCard city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href={`/locations/${location.location_pk}`} location_pk={location.location_pk} isFavorite={favoriteIds.includes(location.location_pk)} />
              </div>
            );
          })
        ) : (
          <p className="pt-4 text-sm text-(--gray-10)">Ingen vaskehaller matcher dine filtre.</p>
        )}
      </div>
    </section>
  );
}
