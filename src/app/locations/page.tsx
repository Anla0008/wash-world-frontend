"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import VaskehalCard from "@/components/global/cards/VaskehalCard";

export default function FindVaskehal() {
  const { getLocations } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function loadLocations() {
      const data = await getLocations();
      setLocations(data);
    }

    loadLocations();
  }, [getLocations]);

  return (
    <section>
      <h1>Vaskehaller i nærheden</h1>

      {locations.map((location) => (
        <VaskehalCard
          key={location.location_pk}
          city={location.location_name}
          address={`${location.location_address}, ${location.location_city}`}
          openingHours="07-22"
          status="Kort ventetid"
          image="/image/washworld.jpg"
          href={`/locations/${location.location_pk}`}
        />
      ))}
    </section>
  );
}
