"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import VaskehalCard from "@/components/global/cards/VaskehalCard";

export default function Favorites() {
  const { getFavorites } = useAuth();
  const [favorites, setFavorites] = useState<Location[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error("Fejl ved indlæsning af favoritter:", error);
      }
    }
    loadFavorites();
  }, [getFavorites]);

  return (
    <div className="max-w-lg w-full flex flex-col gap-15">
      <section className="flex flex-col gap-4">
        <p className="text-2xl font-bold">Favoritter</p>

        {favorites.length === 0 ? <p className="text-sm text-(--gray-40)">Du har ingen favoritter endnu.</p> : favorites.map((location) => <VaskehalCard key={location.location_pk} location_pk={location.location_pk} city={location.location_city} address={location.location_address} openingHours="07 - 22" image={location.location_img} href={`/locations/${location.location_pk}`} isFavorite={true} />)}
      </section>
    </div>
  );
}
