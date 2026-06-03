"use client";
import { useNearestWash } from "@/lib/wash/resolvers";
import CarWashCard from "@/components/global/cards/CarWashCard";
import { useWashHall } from "@/hooks/washHallContext";
import { useEffect } from "react";

const NearestWashCard = () => {
  const { nearestLocation, isLoading } = useNearestWash();
  const { waitTimeByLocationPk, ensureWaitTimesForLocations } = useWashHall();

  // Når nearestLocation er opdateret, sørg for at hente ventetiden for denne lokation
  useEffect(() => {
    if (!nearestLocation?.location_pk) return;
    // Sørg for at hente ventetiden for den nærmeste lokation
    ensureWaitTimesForLocations([nearestLocation.location_pk]);

  }, [nearestLocation, ensureWaitTimesForLocations]);

  if (isLoading) return <p>Indlæser nærmeste vaskehal...</p>;
  if (!nearestLocation) return <p>Ingen lokation fundet i nærheden.</p>;

  const waitTime = waitTimeByLocationPk[nearestLocation.location_pk];
  if (waitTime == null) return <p>Henter ventetid...</p>;

  return (
    <>
      <h2 className="extra-bold">Nærmeste vaskehal</h2>
      <CarWashCard city={nearestLocation.location_city} address={nearestLocation.location_address} image={nearestLocation.location_img} href={`/locations/${nearestLocation.location_pk}`} location_pk={nearestLocation.location_pk} openingHours="07:00 - 22:00" waitTimeSeconds={waitTime} />
    </>
  );
};

export default NearestWashCard;
