"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import FindCarWashBottomSheet from "@/components/findCarWash/FindCarWashBottomSheet";

const FindCarWashMap = dynamic(() => import("@/components/findCarWash/FindCarWashMap"), {
  ssr: false,
});

export default function FindCarWash() {
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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <section className="-mx-8 -mt-8 relative h-dvh overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 z-0 h-full w-full">
        <FindCarWashMap locations={locations} onSelectLocation={(location) => setSelectedLocationPk(location.location_pk)} />
      </div>

      <FindCarWashBottomSheet locations={locations} selectedLocationPk={selectedLocationPk} favoriteIds={favoriteIds} clearSelectedLocation={() => setSelectedLocationPk(null)} />
    </section>
  );
}
