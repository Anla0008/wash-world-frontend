"use client";
import { useNearestWash } from "@/lib/wash/resolvers";
import VaskehalCard from "@/components/global/cards/CarWashCard";

const NearestWashCard = () => {
  const { nearestLocation, isLoading } = useNearestWash();

  if (isLoading) return <p>Indlaeser naermeste vaskehal...</p>;
  if (!nearestLocation) return <p>Ingen lokation fundet i naerheden.</p>;

  return (
    <>
      <h2 className="extra-bold">Nærmeste vaskehal</h2>
      <VaskehalCard city={nearestLocation.location_city} address={nearestLocation.location_address} image={nearestLocation.location_img} href={`/locations/${nearestLocation.location_pk}`} location_pk={nearestLocation.location_pk} openingHours="07:00 - 22:00" />
    </>
  );
};

export default NearestWashCard;
