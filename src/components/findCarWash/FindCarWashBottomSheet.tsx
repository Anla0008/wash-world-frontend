// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { Location } from "@/types/locations";
// import { useLocationFilterStore } from "@/stores/useLocationFilterStore";
// import { SortDirection } from "@/types/filtering";

// import CarWashCard from "@/components/global/cards/CarWashCard";
// import SearchBar from "../global/filtering/SearchBar";
// import FilterWrapper from "../global/filtering/FilterWrapper";
// import Sorting from "../global/filtering/Sorting";

// type FindCarWashBottomSheetProps = {
//   locations: Location[];
//   selectedLocationPk: string | null;
//   favoriteIds: string[];
// };

// type Range = {
//   min: number;
//   max: number;
// };

// type WaitStatus = "Kort ventetid" | "Moderat ventetid" | "Lang ventetid";

// const waitStatuses: WaitStatus[] = ["Kort ventetid", "Moderat ventetid", "Lang ventetid"];

// const waitStatusOrder: Record<WaitStatus, number> = {
//   "Kort ventetid": 1,
//   "Moderat ventetid": 2,
//   "Lang ventetid": 3,
// };

// // Bottom sheet'ets faste højder i procent af skærmen.
// const MIN_HEIGHT = 35;
// const MID_HEIGHT = 60;
// const MAX_HEIGHT = 85;

// // Grænser for hvilken højde sheet'et skal snappe til, når brugeren slipper.
// const SNAP_TO_MIN_LIMIT = 47;
// const SNAP_TO_MID_LIMIT = 72;

// // Finder de forskellige antal, der findes i locations, og sorterer dem fra lavest til højest.
// function getUniqueNumbers(numbers: Array<number | undefined>) {
//   const validNumbers = numbers.filter((number): number is number => number !== undefined);

//   return Array.from(new Set(validNumbers)).sort((a, b) => a - b);
// }

// // Tjekker om en værdi ligger indenfor det valgte filter interval.
// function matchesRange(value: number | undefined, range: Range) {
//   return value !== undefined && value >= range.min && value <= range.max;
// }

// // Finder den højde bottom sheet'et skal ende på, når brugeren slipper.
// function getSnapHeight(currentHeight: number) {
//   if (currentHeight < SNAP_TO_MIN_LIMIT) {
//     return MIN_HEIGHT;
//   }

//   if (currentHeight < SNAP_TO_MID_LIMIT) {
//     return MID_HEIGHT;
//   }

//   return MAX_HEIGHT;
// }

// export default function FindCarWashBottomSheet({ locations, selectedLocationPk, favoriteIds }: FindCarWashBottomSheetProps) {
//   const [height, setHeight] = useState(MID_HEIGHT);
//   const [isDragging, setIsDragging] = useState(false);

//   // State til sortering
//   const [sortDirection, setSortDirection] = useState<SortDirection>("asc"); //asc betyder laveste først

//   // Gemmer startpositionen, når brugeren begynder at trække.
//   const startY = useRef(0);

//   // Gemmer sheet'ets højde, når brugeren begynder at trække.
//   const startHeight = useRef(MID_HEIGHT);

//   // Gemmer en reference til hvert card, så vi kan scrolle til det valgte card.
//   const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // Filter state fra Zustand.
//   const searchTerm = useLocationFilterStore((state) => state.searchTerm);
//   const washHallRange = useLocationFilterStore((state) => state.washHallRange);
//   const selfWashRange = useLocationFilterStore((state) => state.selfWashRange);
//   const selectedFacilities = useLocationFilterStore((state) => state.selectedFacilities);

//   // Finder de tal, der faktisk findes i locations, så filteret matcher data.
//   const washHallNumbers = getUniqueNumbers(locations.map((location) => location.car_wash_hall_number));

//   const selfWashNumbers = getUniqueNumbers(locations.map((location) => location.car_wash_self));

//   const maxWashHallNumber = washHallNumbers.at(-1) ?? 1;

//   const minSelfWashNumber = selfWashNumbers.at(0) ?? 0;
//   const maxSelfWashNumber = selfWashNumbers.at(-1) ?? 0;

//   const filteredLocations = locations.filter((location) => {
//     const searchValue = searchTerm.toLowerCase().trim();

//     const city = location.location_city.toLowerCase();
//     const address = location.location_address.toLowerCase();

//     const matchesSearch = city.includes(searchValue) || address.includes(searchValue);

//     const matchesWashHallRange = matchesRange(location.car_wash_hall_number, washHallRange);

//     const matchesSelfWashRange = matchesRange(location.car_wash_self, selfWashRange);

//     // Kobler navnet på filteret sammen med feltet fra location.
//     const facilityMap: Record<string, number | undefined> = {
//       Højtryksforvask: location.car_wash_high_pressure,
//       Støvsuger: location.car_wash_vacuum,
//       "Vask selv": location.car_wash_self,
//     };

//     const matchesFacilities = selectedFacilities.every((facility) => {
//       return Number(facilityMap[facility]) > 0;
//     });

//     return matchesSearch && matchesWashHallRange && matchesSelfWashRange && matchesFacilities;
//   });

//   const waitStatusByLocationPk = useMemo(() => {
//     return locations.reduce<Record<string, WaitStatus>>((acc, location) => {
//       const randomIndex = Math.floor(Math.random() * waitStatuses.length);

//       acc[location.location_pk] = waitStatuses[randomIndex];

//       return acc;
//     }, {});
//   }, [locations]);

//   function getWaitTimeForLocation(location: Location) {
//     return location.car_wash_hall_number ?? 0; // Her skal der laves en rigtig så ventetid kommer
//   }

//   const sortedLocations = [...filteredLocations].sort((a, b) => {
//     const waitTimeA = getWaitTimeForLocation(a);
//     const waitTimeB = getWaitTimeForLocation(b);

//     if (sortDirection === "asc") {
//       return waitTimeA - waitTimeB; // Laveste ventetid først
//     }

//     return waitTimeB - waitTimeA; // Højeste ventetid først
//   });

//   useEffect(() => {
//     if (!selectedLocationPk) return;

//     const selectedCard = cardRefs.current[selectedLocationPk];

//     if (!selectedCard) return;

//     // Åbner sheet'et, så det valgte card bliver synligt.
//     setHeight(MAX_HEIGHT);

//     // Venter kort, så sheet'et når at åbne, før der scrolles.
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
//     const dragPercent = (dragDistance / window.innerHeight) * 100;

//     const newHeight = startHeight.current + dragPercent;

//     // Holder sheet'et mellem minimum og maksimum højden.
//     const limitedHeight = Math.min(Math.max(newHeight, MIN_HEIGHT), MAX_HEIGHT);

//     setHeight(limitedHeight);
//   }

//   function handlePointerUp() {
//     setIsDragging(false);

//     // Når brugeren slipper, snapper sheet'et til en af de faste højder.
//     setHeight(getSnapHeight(height));
//   }

//   return (
//     <section className={`fixed bottom-0 left-1/2 z-50 flex w-full max-w-107 -translate-x-1/2 flex-col rounded-t-3xl bg-background px-4 pt-3 pb-4 text-foreground shadow-2xl ${isDragging ? "" : "transition-all duration-300"}`} style={{ height: `${height}dvh` }}>
//       <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} className="mx-auto mb-3 flex h-7 w-full shrink-0 touch-none cursor-grab select-none items-center justify-center active:cursor-grabbing" role="button" aria-label="Træk bottom sheet op eller ned">
//         <span className="h-1 w-12 rounded-full bg-(--gray-60)" />
//       </div>

//       <div className="mb-4 shrink-0">
//         <h2 className="text-2xl font-medium">Vaskehaller</h2>
//         <p className="text-sm font-light text-(--gray-10)">Find en vaskehal tæt på dig</p>
//       </div>

//       <div className="mb-4 flex w-full shrink-0 flex-col gap-3">
//         <SearchBar />

//         <FilterWrapper maxWashHallNumber={maxWashHallNumber} washHallNumbers={washHallNumbers} minSelfWashNumber={minSelfWashNumber} maxSelfWashNumber={maxSelfWashNumber} selfWashNumbers={selfWashNumbers} />
//       </div>

//       <div className="mb-4 shrink-0">
//         <Sorting label="Ventetid" direction={sortDirection} defaultDirection="asc" onDirectionChange={setSortDirection} />
//       </div>

//       <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-24">
//         {sortedLocations.length > 0 ? (
//           sortedLocations.map((location) => {
//             const isSelected = selectedLocationPk === location.location_pk;

//             return (
//               <div
//                 key={location.location_pk}
//                 ref={(element) => {
//                   cardRefs.current[location.location_pk] = element;
//                 }}
//                 className={`px-3 rounded-md transition-all duration-300 ${isSelected ? "ring-4 ring-(--brand-green)" : ""}`}
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

import { useEffect, useMemo, useRef, useState } from "react";
import { Location } from "@/types/locations";
import { useLocationFilterStore } from "@/stores/useLocationFilterStore";
import { SortDirection } from "@/types/filtering";

import CarWashCard from "@/components/global/cards/CarWashCard";
import SearchBar from "../global/filtering/SearchBar";
import FilterWrapper from "../global/filtering/FilterWrapper";
import Sorting from "../global/filtering/Sorting";

type FindCarWashBottomSheetProps = {
  locations: Location[];
  selectedLocationPk: string | null;
  favoriteIds: string[];
};

type Range = {
  min: number;
  max: number;
};

type WaitStatus = "Kort ventetid" | "Moderat ventetid" | "Lang ventetid";

const waitStatuses: WaitStatus[] = ["Kort ventetid", "Moderat ventetid", "Lang ventetid"];

const waitStatusOrder: Record<WaitStatus, number> = {
  "Kort ventetid": 1,
  "Moderat ventetid": 2,
  "Lang ventetid": 3,
};

// Bottom sheet'ets faste højder i procent af skærmen.
const MIN_HEIGHT = 35;
const MID_HEIGHT = 60;
const MAX_HEIGHT = 85;

// Grænser for hvilken højde sheet'et skal snappe til, når brugeren slipper.
const SNAP_TO_MIN_LIMIT = 47;
const SNAP_TO_MID_LIMIT = 72;

// Finder de forskellige antal, der findes i locations, og sorterer dem fra lavest til højest.
function getUniqueNumbers(numbers: Array<number | undefined>) {
  const validNumbers = numbers.filter((number): number is number => number !== undefined);

  return Array.from(new Set(validNumbers)).sort((a, b) => a - b);
}

// Tjekker om en værdi ligger indenfor det valgte filter interval.
function matchesRange(value: number | undefined, range: Range) {
  return value !== undefined && value >= range.min && value <= range.max;
}

// Finder den højde bottom sheet'et skal ende på, når brugeren slipper.
function getSnapHeight(currentHeight: number) {
  if (currentHeight < SNAP_TO_MIN_LIMIT) {
    return MIN_HEIGHT;
  }

  if (currentHeight < SNAP_TO_MID_LIMIT) {
    return MID_HEIGHT;
  }

  return MAX_HEIGHT;
}

export default function FindCarWashBottomSheet({ locations, selectedLocationPk, favoriteIds }: FindCarWashBottomSheetProps) {
  const [height, setHeight] = useState(MID_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  // State til sortering
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc"); // asc betyder laveste først

  // Gemmer startpositionen, når brugeren begynder at trække.
  const startY = useRef(0);

  // Gemmer sheet'ets højde, når brugeren begynder at trække.
  const startHeight = useRef(MID_HEIGHT);

  // Gemmer en reference til hvert card, så vi kan scrolle til det valgte card.
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter state fra Zustand.
  const searchTerm = useLocationFilterStore((state) => state.searchTerm);
  const washHallRange = useLocationFilterStore((state) => state.washHallRange);
  const selfWashRange = useLocationFilterStore((state) => state.selfWashRange);
  const selectedFacilities = useLocationFilterStore((state) => state.selectedFacilities);

  // Finder de tal, der faktisk findes i locations, så filteret matcher data.
  const washHallNumbers = getUniqueNumbers(locations.map((location) => location.car_wash_hall_number));

  const selfWashNumbers = getUniqueNumbers(locations.map((location) => location.car_wash_self));

  const maxWashHallNumber = washHallNumbers.at(-1) ?? 1;

  const minSelfWashNumber = selfWashNumbers.at(0) ?? 0;
  const maxSelfWashNumber = selfWashNumbers.at(-1) ?? 0;

  // Laver én random ventestatus pr. location_pk.
  // Det er vigtigt, at status bliver lavet her i bottomsheet, fordi listen skal sorteres efter den samme status, som cardet viser.
  const waitStatusByLocationPk = useMemo(() => {
    return locations.reduce<Record<string, WaitStatus>>((acc, location) => {
      const randomIndex = Math.floor(Math.random() * waitStatuses.length);

      acc[location.location_pk] = waitStatuses[randomIndex];

      return acc;
    }, {});
  }, [locations]);

  // Finder ventestatus for en bestemt vaskehal.
  function getWaitStatusForLocation(location: Location) {
    return waitStatusByLocationPk[location.location_pk] ?? "Kort ventetid";
  }

  const filteredLocations = locations.filter((location) => {
    const searchValue = searchTerm.toLowerCase().trim();

    const city = location.location_city.toLowerCase();
    const address = location.location_address.toLowerCase();

    const matchesSearch = city.includes(searchValue) || address.includes(searchValue);

    const matchesWashHallRange = matchesRange(location.car_wash_hall_number, washHallRange);

    const matchesSelfWashRange = matchesRange(location.car_wash_self, selfWashRange);

    // Kobler navnet på filteret sammen med feltet fra location.
    const facilityMap: Record<string, number | undefined> = {
      Højtryksforvask: location.car_wash_high_pressure,
      Støvsuger: location.car_wash_vacuum,
      "Vask selv": location.car_wash_self,
    };

    const matchesFacilities = selectedFacilities.every((facility) => {
      return Number(facilityMap[facility]) > 0;
    });

    return matchesSearch && matchesWashHallRange && matchesSelfWashRange && matchesFacilities;
  });

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    const waitStatusA = getWaitStatusForLocation(a);
    const waitStatusB = getWaitStatusForLocation(b);

    const waitValueA = waitStatusOrder[waitStatusA];
    const waitValueB = waitStatusOrder[waitStatusB];

    if (sortDirection === "asc") {
      return waitValueA - waitValueB; // Kort ventetid først
    }

    return waitValueB - waitValueA; // Lang ventetid først
  });

  useEffect(() => {
    if (!selectedLocationPk) return;

    const selectedCard = cardRefs.current[selectedLocationPk];

    if (!selectedCard) return;

    // Åbner sheet'et, så det valgte card bliver synligt.
    setHeight(MAX_HEIGHT);

    // Venter kort, så sheet'et når at åbne, før der scrolles.
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
    const dragPercent = (dragDistance / window.innerHeight) * 100;

    const newHeight = startHeight.current + dragPercent;

    // Holder sheet'et mellem minimum og maksimum højden.
    const limitedHeight = Math.min(Math.max(newHeight, MIN_HEIGHT), MAX_HEIGHT);

    setHeight(limitedHeight);
  }

  function handlePointerUp() {
    setIsDragging(false);

    // Når brugeren slipper, snapper sheet'et til en af de faste højder.
    setHeight(getSnapHeight(height));
  }

  return (
    <section className={`fixed bottom-0 left-1/2 z-50 flex w-full max-w-107 -translate-x-1/2 flex-col rounded-t-3xl bg-background px-4 pt-3 pb-4 text-foreground shadow-2xl ${isDragging ? "" : "transition-all duration-300"}`} style={{ height: `${height}dvh` }}>
      <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} className="mx-auto mb-3 flex h-7 w-full shrink-0 touch-none cursor-grab select-none items-center justify-center active:cursor-grabbing" role="button" aria-label="Træk bottom sheet op eller ned">
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

      <div className="mb-4 shrink-0">
        <Sorting label="Ventetid" direction={sortDirection} defaultDirection="asc" onDirectionChange={setSortDirection} />
      </div>

      <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-24">
        {sortedLocations.length > 0 ? (
          sortedLocations.map((location) => {
            const isSelected = selectedLocationPk === location.location_pk;

            return (
              <div
                key={location.location_pk}
                ref={(element) => {
                  cardRefs.current[location.location_pk] = element;
                }}
                className={`px-3 rounded-md transition-all duration-300 ${isSelected ? "ring-4 ring-(--brand-green)" : ""}`}
              >
                <CarWashCard city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href={`/locations/${location.location_pk}`} location_pk={location.location_pk} isFavorite={favoriteIds.includes(location.location_pk)} waitStatus={getWaitStatusForLocation(location)} />
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
