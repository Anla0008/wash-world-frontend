"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import FindVaskehalBottomSheet from "@/components/findVaskehal/FindVaskehalBottomSheet";

const FindVaskehalMap = dynamic(() => import("@/components/findVaskehal/FindVaskehalMap"), {
  ssr: false,
});

export default function FindVaskehal() {
  const { getLocations, getFavorites } = useAuth();

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationPk, setSelectedLocationPk] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadLocations() {
      const data = await getLocations();
      setLocations(data);

      const favs = await getFavorites();
      setFavoriteIds(favs.map((f: Location) => f.location_pk));
    }

    loadLocations();
  }, [getLocations, getFavorites]);

  return (
    <main className="-mx-8 relative h-dvh overflow-hidden bg-background text-foreground">
      <section className="absolute inset-0 z-0 h-full w-full">
        <FindVaskehalMap locations={locations} onSelectLocation={(location) => setSelectedLocationPk(location.location_pk)} />
      </section>

      <FindVaskehalBottomSheet locations={locations} selectedLocationPk={selectedLocationPk} favoriteIds={favoriteIds} />
    </main>
  );
}
