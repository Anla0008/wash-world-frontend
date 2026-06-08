"use client";

import { useEffect, useRef, useState } from "react";
import { Location } from "@/types/locations";
import { useLocationFilterStore } from "@/stores/useLocationFilterStore";

import CarWashCard from "@/components/global/cards/CarWashCard";
import SearchBar from "../global/filtering/SearchBar";
import FilterWrapper from "../global/filtering/FilterWrapper";
import Sorting from "../global/filtering/Sorting";

import type { FindCarWashBottomSheetProps } from "@/types/locations";
import type { Range, SortDirection } from "@/types/filtering";
import { resolveWaitStatusLabel } from "@/lib/wash/waitTime";
import { useWashHall } from "@/components/global/washHallContext";

// ===========================================================
//                    HELPER: DISTANCE
// ===========================================================

// Beregner afstanden mellem brugerens position og en lokation.
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Jordens radius i kilometer

  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Konverterer forskellen i breddegrader til radianer
  const dLng = ((lng2 - lng1) * Math.PI) / 180; // Konverterer forskellen i længdegrader til radianer

  const a = Math.sin(dLat / 2) ** 2 * Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2; // Haversine-formlen

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Afstanden i kilometer
}

// ===========================================================
//                       COMPONENT START
// ===========================================================

export default function FindCarWashBottomSheet({ locations, selectedLocationPk, favoriteIds, clearSelectedLocation }: FindCarWashBottomSheetProps) {
  // ===========================================================
  //                    BOTTOM SHEET LOGIC
  // ===========================================================

  // De tre faste højder som bottom sheet'et kan lande på.
  const MIN_HEIGHT = 35; // 35% af skærmens højde
  const MID_HEIGHT = 60; // 60% af skærmens højde
  const MAX_HEIGHT = 85; // 85% af skærmens højde

  const [height, setHeight] = useState(MID_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  // Gemmer hvor brugeren startede med at trække.
  const startY = useRef(0);

  // Gemmer hvilken højde sheet'et havde, da brugeren startede med at trække.
  const startHeight = useRef(MID_HEIGHT);

  // Finder den højde, sheet'et skal lande på, når brugeren slipper det.
  function getSnapHeight(currentHeight: number) {
    const middleBetweenMinAndMid = (MIN_HEIGHT + MID_HEIGHT) / 2;
    const middleBetweenMidAndMax = (MID_HEIGHT + MAX_HEIGHT) / 2;

    if (currentHeight < middleBetweenMinAndMid) {
      return MIN_HEIGHT;
    }

    if (currentHeight < middleBetweenMidAndMax) {
      return MID_HEIGHT;
    }

    return MAX_HEIGHT;
  }
  // Funktion der tager et react event som parameter, hvilket gør det muligt at tilgå cursorens position og pointerId, som bruges til at trække i sheet'et.
  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setIsDragging(true);

    startY.current = event.clientY; // Cursorens position i Y-aksen, når brugeren starter med at trække.
    startHeight.current = height; // Sheet'ets højde i det øjeblik, brugeren starter med at trække.

    // Sikrer at vi fortsat får pointer events,
    // selvom cursoren bevæger sig udenfor det hvide område, der udløste onPointerDown.
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (isDragging === false) return;

    const draggedPixels = startY.current - event.clientY;
    const draggedPercent = (draggedPixels / window.innerHeight) * 100;

    let newHeight = startHeight.current + draggedPercent; //newHeight er en let fordi den opdateres løbende, mens brugeren trækker.

    // Følgende if-statements tjekker om den er indenfor de tilladte grænser (MIN_HEIGHT og MAX_HEIGHT)
    // og begrænser bottom sheet til kun at kunne trækkes til disse.
    if (newHeight < MIN_HEIGHT) {
      newHeight = MIN_HEIGHT;
    }

    if (newHeight > MAX_HEIGHT) {
      newHeight = MAX_HEIGHT;
    }

    setHeight(newHeight);
  }

  function handlePointerUp() {
    setIsDragging(false);

    const finalHeight = getSnapHeight(height);

    setHeight(finalHeight);
  }
  // ===========================================================
  //                    USER LOCATION LOGIC
  // ===========================================================

  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      setUserCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  // ===========================================================
  //                    WAIT TIME LOGIC
  // ===========================================================

  //waitTimeByLocationPk er et object der mapper location_pk til ventetid i sekunder.
  //ensureWaitTimeForLocations er en funktion der henter ventertider hvis de ikke allerede er hentet.
  const { waitTimeByLocationPk, ensureWaitTimesForLocations } = useWashHall();

  // Tjekker om vi har hentet ventetiden for alle de locations, der vises i sheet'et.
  const isWaitTimeReady = locations.every((location) => {
    return waitTimeByLocationPk[location.location_pk] != null;
  });

  useEffect(() => {
    // Henter ventetider for alle locations i sheet'et, hvis de ikke allerede er hentet.
    const locationPks = locations.map((location) => location.location_pk);

    ensureWaitTimesForLocations(locationPks); //Har vi allerede ventetid - gør ingenting.
  }, [locations, ensureWaitTimesForLocations]); // Har vi ikke ventetid - hent ventetid for alle locations i sheet'et.

  //Funktion får ventetid fra en specefik lokation.
  function getWaitTimeForLocation(location: Location) {
    const waitTime = waitTimeByLocationPk[location.location_pk];

    // Hvis vi ikke har ventetid for lokationen, er det en fejl.
    if (waitTime == null) {
      throw new Error(`Mangler ventetid for location_pk: ${location.location_pk}`);
    }

    // Ellers returnerer vi ventetiden.
    return waitTime;
  }

  //Oversætter ventetiden til en label.
  function getWaitStatusForLocation(location: Location) {
    const waitTime = getWaitTimeForLocation(location);

    return resolveWaitStatusLabel(waitTime);
  }

  // ===========================================================
  //                    FILTER LOGIC
  // ===========================================================

  const searchTerm = useLocationFilterStore((state) => state.searchTerm);
  const washHallRange = useLocationFilterStore((state) => state.washHallRange);
  const selfWashRange = useLocationFilterStore((state) => state.selfWashRange);
  const selectedFacilities = useLocationFilterStore((state) => state.selectedFacilities);
  const resetFilters = useLocationFilterStore((state) => state.resetFilters);

  // Finder de antal, som filteret kan bruge.
  // Det kan fx være antal vaskehaller eller antal selvvask pladser fra locations.
  // Først fjernes tomme værdier, derefter fjernes gentagelser, og til sidst sorteres tallene.
  function getAvailableFilterNumbers(numbers: Array<number | undefined>) {
    const validNumbers = numbers.filter((number): number is number => {
      return number !== undefined;
    });

    return Array.from(new Set(validNumbers)).sort((a, b) => a - b); // Sorterer tallene i stigende rækkefølge i et array.
  }

  // Tjekker om tallet ligger indenfor det valgte interval.
  // (value: number | undefined, range: Range) = Hvilke slags værdier funktionen forventer at modtage.
  function matchesRange(value: number | undefined, range: Range) {
    return value !== undefined && value >= range.min && value <= range.max;
  }

  // Tjekker én facilitet ad gangen.
  function locationHasFacility(location: Location, facility: string) {
    if (facility === "Højtryksforvask") {
      return Number(location.car_wash_high_pressure) > 0;
    }

    if (facility === "Støvsuger") {
      return Number(location.car_wash_vacuum) > 0;
    }

    if (facility === "Vask selv") {
      return Number(location.car_wash_self) > 0;
    }

    return false;
  }

  // Tjekker om lokationen matcher alle de faciliteter, brugeren har valgt.
  function matchesSelectedFacilities(location: Location) {
    return selectedFacilities.every((facility) => {
      return locationHasFacility(location, facility);
    });
  }

  const washHallNumbers = getAvailableFilterNumbers(locations.map((location) => location.car_wash_hall_number));

  const selfWashNumbers = getAvailableFilterNumbers(locations.map((location) => location.car_wash_self));

  // Henter det højeste antal vaskehaller der findes blandt lokationerne.
  // Hvis ingen lokationer har vaskehaller, bruges 1 som fallback.
  const maxWashHallNumber = washHallNumbers.at(-1) ?? 1;

  // Henter det laveste antal selvvask pladser der findes blandt lokationerne.
  // Hvis ingen lokationer har selvvask, bruges 0 som fallback.
  const minSelfWashNumber = selfWashNumbers.at(0) ?? 0;

  // Henter det højeste antal selvvask pladser der findes blandt lokationerne.
  // Hvis ingen lokationer har selvvask, bruges 0 som fallback.
  const maxSelfWashNumber = selfWashNumbers.at(-1) ?? 0;

  // Boolean der tjekker om der er nogen filtre aktive.
  const hasFilters = selectedFacilities.length > 0 || washHallRange.min !== 1 || washHallRange.max !== maxWashHallNumber || selfWashRange.min !== minSelfWashNumber || selfWashRange.max !== maxSelfWashNumber || searchTerm.trim() !== "";

  const searchValue = searchTerm.toLowerCase().trim();

  //filteredLocations returnere et array af lokationer, der matcher de aktive filtre og søgetermen.
  const filteredLocations = locations.filter((location) => {
    const city = location.location_city.toLowerCase();
    const address = location.location_address.toLowerCase();

    // Søger både i by og adresse.
    // Derfor kan ét bogstav stadig matche mange resultater, fx hvis adressen indeholder "vej".
    const matchesSearch = city.includes(searchValue) || address.includes(searchValue);

    const matchesWashHallRange = matchesRange(location.car_wash_hall_number, washHallRange);

    const matchesSelfWashRange = matchesRange(location.car_wash_self, selfWashRange);

    const matchesFacilities = matchesSelectedFacilities(location);

    return matchesSearch && matchesWashHallRange && matchesSelfWashRange && matchesFacilities;
  });

  // ===========================================================
  //                    SORTING LOGIC
  // ===========================================================

  const waitStatusOrder = {
    "Kort ventetid": 1,
    "Moderat ventetid": 2,
    "Lang ventetid": 3,
  } as const; //as const betyder at TypeScript forstår at værdierne er faste.

  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [sortByWaitTime, setSortByWaitTime] = useState(false);

  function sortByDistance(a: Location, b: Location) {
    // Hvis brugerens position ikke er klar endnu, ændrer vi ikke rækkefølgen.
    if (!userCoords) {
      return 0;
    }

    // Hvis en lokation mangler koordinater, kan vi ikke beregne afstand.
    if (!a.location_lat || !a.location_lng || !b.location_lat || !b.location_lng) {
      return 0;
    }

    // Beregner afstanden fra brugerens position til hver lokation.
    const distanceA = getDistanceKm(userCoords.lat, userCoords.lng, a.location_lat, a.location_lng);

    const distanceB = getDistanceKm(userCoords.lat, userCoords.lng, b.location_lat, b.location_lng);

    // Laveste afstand kommer først.
    return distanceA - distanceB;
  }

  function sortByWaitTimeStatus(a: Location, b: Location) {
    const waitValueA = waitStatusOrder[getWaitStatusForLocation(a)];
    const waitValueB = waitStatusOrder[getWaitStatusForLocation(b)];

    // asc betyder kortest ventetid først.
    if (sortDirection === "asc") {
      return waitValueA - waitValueB;
    }

    // Ellers vises længst ventetid først.
    return waitValueB - waitValueA;
  }
  //[...filteredLocations] er en let kopi af det filtrerede locations array, som vi kan sortere uden at ændre på det originale array i state.
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    // Hvis ventetiderne ikke er klar endnu, beholder vi den filtrerede rækkefølge.
    if (!isWaitTimeReady) {
      return 0;
    }

    // Hvis brugeren har valgt ventetid, sorterer vi efter ventestatus.
    if (sortByWaitTime) {
      return sortByWaitTimeStatus(a, b);
    }

    // Ellers bruger vi standard sortering efter afstand.
    return sortByDistance(a, b);
  });

  // Første gang brugeren vælger ventetid, starter sorteringen altid med kortest ventetid først.
  // Derefter kan brugeren skifte mellem asc og desc.
  function handleSortByWaitTime(direction: SortDirection) {
    if (!sortByWaitTime) {
      setSortDirection("asc");
    } else {
      setSortDirection(direction);
    }

    setSortByWaitTime(true);
  }

  // ===========================================================
  //                    SELECTED CARD LOGIC
  // ===========================================================

  useEffect(() => {
    if (!selectedLocationPk) return;

    // Åbner bottom sheet'et, så det valgte card kan ses.
    setHeight(MAX_HEIGHT);

    // Venter kort, så sheet'et når at åbne, før vi scroller.
    setTimeout(() => {
      const selectedCard = document.getElementById(`location-card-${selectedLocationPk}`);

      if (!selectedCard) return;

      selectedCard.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  }, [selectedLocationPk]);

  // ===========================================================
  //                    RESET LOGIC
  // ===========================================================

  function handleReset() {
    setSortByWaitTime(false);
    resetFilters(maxWashHallNumber, minSelfWashNumber, maxSelfWashNumber);
  }

  // ===========================================================
  //                         RENDER
  // ===========================================================

  return (
    <section className={`fixed bottom-0 left-1/2 z-50 flex w-full max-w-107 -translate-x-1/2 flex-col rounded-t-3xl bg-background px-4 pt-3 pb-4 text-foreground shadow-2xl ${isDragging ? "" : "transition-all duration-300"}`} style={{ height: `${height}dvh` }}>
      {/* Drag handle */}
      <div onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} className="mx-auto mb-3 flex h-7 w-full shrink-0 touch-none cursor-grab select-none items-center justify-center active:cursor-grabbing" role="button" aria-label="Træk bottom sheet op eller ned">
        <span className="h-1 w-12 rounded-full bg-(--gray-60)" />
      </div>

      {/* Header */}
      <div className="mb-4 shrink-0 mx-4">
        <h2 className="extra-bold">Vaskehaller</h2>
        <p className="text-sm font-light text-(--gray-10)">Find en vaskehal tæt på dig</p>
      </div>

      {/* Search, sorting and filters */}
      <div onClickCapture={clearSelectedLocation} className="mb-4 flex w-full shrink-0 flex-col gap-3">
        <SearchBar />

        <div className="flex items-center gap-6 mt-6 mx-4">
          <Sorting label="Ventetid" direction={sortDirection} defaultDirection="asc" onDirectionChange={handleSortByWaitTime} />

          <FilterWrapper maxWashHallNumber={maxWashHallNumber} washHallNumbers={washHallNumbers} minSelfWashNumber={minSelfWashNumber} maxSelfWashNumber={maxSelfWashNumber} selfWashNumbers={selfWashNumbers} />

          {(sortByWaitTime || hasFilters) && (
            <button type="button" onClick={handleReset} className="ml-auto text-sm text-(--gray-10) underline cursor-pointer">
              Nulstil
            </button>
          )}
        </div>
      </div>

      {/* Location cards */}
      <div className="hide-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto gap-4 pb-24">
        {!isWaitTimeReady ? (
          <p className="pt-4 text-sm text-(--gray-10)">Indlæser ventetider...</p>
        ) : sortedLocations.length > 0 ? (
          sortedLocations.map((location) => {
            const isSelected = selectedLocationPk === location.location_pk;

            return (
              <div key={location.location_pk} id={`location-card-${location.location_pk}`} className={`px-3 rounded-md transition-all duration-300 ${isSelected ? "ring-4 ring-(--brand-green)" : ""}`}>
                <CarWashCard city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href={`/locations/${location.location_pk}`} location_pk={location.location_pk} isFavorite={favoriteIds.includes(location.location_pk)} waitTimeSeconds={getWaitTimeForLocation(location)} />
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
