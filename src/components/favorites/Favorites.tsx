"use client";

// ===========================================================
//                         IMPORTS
// ===========================================================

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useWashHall } from "@/components/global/washHallContext";

import CarWashCard from "@/components/global/cards/CarWashCard";

// ===========================================================
//                       COMPONENT START
// ===========================================================

export default function Favorites() {
  // ===========================================================
  //                    FAVORITES DATA LOGIC
  // ===========================================================

  const { getFavorites } = useAuth();

  // Gemmer brugerens favorit lokationer.
  const [favorites, setFavorites] = useState<Location[]>([]);

  // Henter listen af favorit id'er fra global state.
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);

  // Henter favoritter første gang siden vises.
  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites();

        setFavorites(data);
      } catch (error) {
        console.error("Der skete en fejl ved hentning af favoritter:", error);
      }
    }

    loadFavorites();
  }, [getFavorites]);

  // Opdaterer listen, hvis en favorit bliver fjernet.
  useEffect(() => {
    const updatedFavorites = favorites.filter((location) => {
      return favoriteIds.has(location.location_pk);
    });

    setFavorites(updatedFavorites);
  }, [favoriteIds]);

  // ===========================================================
  //                       WAIT TIME LOGIC
  // ===========================================================

  const { waitTimeByLocationPk, ensureWaitTimesForLocations } = useWashHall();

  // Henter ventetider for alle favorit lokationer.
  useEffect(() => {
    const favoriteLocationPks = favorites.map((favorite) => {
      return favorite.location_pk;
    });

    ensureWaitTimesForLocations(favoriteLocationPks);
  }, [favorites, ensureWaitTimesForLocations]);

  // Tjekker om alle ventetider er klar.
  const isWaitTimeReady = favorites.every((favorite) => {
    return waitTimeByLocationPk[favorite.location_pk] != null;
  });

  // ===========================================================
  //                    REMOVE ANIMATION LOGIC
  // ===========================================================

  // Gemmer de cards, der er ved at fade ud.
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());

  function handleRemove(location_pk: string) {
    // Tilføjer lokationen til fadingOut, så animationen starter.
    setFadingOut((previousFadingOut) => {
      const updatedFadingOut = new Set(previousFadingOut);

      updatedFadingOut.add(location_pk);

      return updatedFadingOut;
    });

    // Fjerner lokationen fra fadingOut igen, når animationen er færdig.
    setTimeout(() => {
      setFadingOut((previousFadingOut) => {
        const updatedFadingOut = new Set(previousFadingOut);

        updatedFadingOut.delete(location_pk);

        return updatedFadingOut;
      });
    }, 300);
  }

  // ===========================================================
  //                         RENDER
  // ===========================================================

  return (
    <div className="max-w-lg w-full flex flex-col gap-15">
      <section className="flex flex-col gap-4">
        <h1 className="extra-bold">Favoritter</h1>

        {favorites.length === 0 ? (
          <p className="text-sm text-(--gray-40)">Du har ingen favoritter endnu.</p>
        ) : !isWaitTimeReady ? (
          <p className="text-sm text-(--gray-40)">Indlæser ventetider...</p>
        ) : (
          favorites.map((location) => {
            const isFadingOut = fadingOut.has(location.location_pk);

            return (
              <div
                key={location.location_pk}
                className="transition-all duration-300"
                style={{
                  opacity: isFadingOut ? 0 : 1,
                  transform: isFadingOut ? "scale(0.95)" : "scale(1)",
                }}
              >
                <CarWashCard location_pk={location.location_pk} city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href={`/locations/${location.location_pk}`} onRemove={() => handleRemove(location.location_pk)} waitTimeSeconds={waitTimeByLocationPk[location.location_pk]} />
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
