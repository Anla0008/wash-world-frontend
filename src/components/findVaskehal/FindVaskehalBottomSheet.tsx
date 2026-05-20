"use client";

import { useEffect, useRef, useState } from "react";
import { Location } from "@/types/locations";
import VaskehalCard from "@/components/global/cards/VaskehalCard";

type FindVaskehalBottomSheetProps = {
  locations: Location[];
  selectedLocationPk: string | null;
  favoriteIds: string[];
};

// Højder i procent af skærmen
const MIN_HEIGHT = 35;
const MID_HEIGHT = 60;
const MAX_HEIGHT = 85;

export default function FindVaskehalBottomSheet({ locations, selectedLocationPk, favoriteIds }: FindVaskehalBottomSheetProps) {
  const [height, setHeight] = useState(MID_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const startY = useRef(0);
  const startHeight = useRef(MID_HEIGHT);

  // Her gemmer vi en reference til hvert card ud fra location_pk.
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

      <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pb-28">
        {locations.map((location) => {
          const isSelected = selectedLocationPk === location.location_pk;

          return (
            <div
              key={location.location_pk}
              ref={(element) => {
                cardRefs.current[location.location_pk] = element;
              }}
              className={`rounded-md transition-all duration-300 ${isSelected ? "ring-4 ring-(--brand-green)" : ""}`}
            >
              {/* <VaskehalCard city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href="#" location_pk={location.location_pk} /> */}
              <VaskehalCard city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href={`/locations/${location.location_pk}`} location_pk={location.location_pk} isFavorite={favoriteIds.includes(location.location_pk)} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
