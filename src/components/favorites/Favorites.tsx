"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import CarWashCard from "@/components/global/cards/CarWashCard";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useWashHall } from "@/hooks/washHallContext";

export default function Favorites() {
  const { getFavorites } = useAuth();
  const [favorites, setFavorites] = useState<Location[]>([]);
  const [fadingOut, setFadingOut] = useState<Set<string>>(new Set());
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const { waitTimeByLocationPk, ensureWaitTimesForLocations } = useWashHall();

  // Hent favoritter ved komponentens første indlæsning
  useEffect(() => {
    getFavorites().then(setFavorites).catch(console.error);
  }, []);

  // Synkroniser listen når favoriteIds ændres (fx når bruger fjerner en favorit)
  useEffect(() => {
    setFavorites((prev) =>
      prev.filter((loc) => favoriteIds.has(loc.location_pk)),
    );
  }, [favoriteIds]);

  useEffect(() => {
    ensureWaitTimesForLocations(favorites.map((favorite) => favorite.location_pk));
  }, [favorites, ensureWaitTimesForLocations]);

  const isWaitTimeReady = favorites.every((favorite) => waitTimeByLocationPk[favorite.location_pk] != null);

  const handleRemove = (location_pk: string) => {
    setFadingOut((prev) => new Set(prev).add(location_pk));
    setTimeout(() => {
      setFadingOut((prev) => {
        const next = new Set(prev);
        next.delete(location_pk);
        return next;
      });
    }, 300);
  };

  return (
    <div className="max-w-lg w-full flex flex-col gap-15">
      <section className="flex flex-col gap-4">
        <h1 className="extra-bold">Favoritter</h1>

        {favorites.length === 0 ? (
          <p className="text-sm text-(--gray-40)">
            Du har ingen favoritter endnu.
          </p>
        ) : !isWaitTimeReady ? (
          <p className="text-sm text-(--gray-40)">Indlæser ventetider...</p>
        ) : (
          favorites.map((location) => (
            <div
              key={location.location_pk}
              className="transition-all duration-300"
              style={{
                opacity: fadingOut.has(location.location_pk) ? 0 : 1,
                transform: fadingOut.has(location.location_pk)
                  ? "scale(0.95)"
                  : "scale(1)",
              }}
            >
              <CarWashCard
                location_pk={location.location_pk}
                city={location.location_city}
                address={location.location_address}
                openingHours={location.openingHours}
                image={location.location_img}
                href={`/locations/${location.location_pk}`}
                onRemove={() => handleRemove(location.location_pk)}
                waitTimeSeconds={waitTimeByLocationPk[location.location_pk]}
              />
            </div>
          ))
        )}
      </section>
    </div>
  );
}
