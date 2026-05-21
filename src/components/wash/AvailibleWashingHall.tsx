"use client";

import { useEffect } from "react";
import { useWash } from "@/hooks/useWash";
import { useNearestWash } from "@/lib/wash/resolvers";
import { useWashStore } from "@/stores/useWashStore";

const AvailibleWashingHall = () => {
  const { nearestLocation } = useNearestWash();
  const { useAvailableWashHall } = useWash();
  const { availibleWashHall, setAvailibleWashHall } = useWashStore();

  const { hall, isLoading, error } = useAvailableWashHall(
    nearestLocation?.location_pk
  );

  // Gem hallen i store første gang den hentes, så den er den samme igennem hele flowet
  useEffect(() => {
    if (hall && availibleWashHall === null) {
      setAvailibleWashHall(hall.car_wash_hall_number);
    }
  }, [hall, availibleWashHall, setAvailibleWashHall]);

  if (isLoading) {
    return <p>Finder ledig vaskehal...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!availibleWashHall) {
    return <p>Ingen ledige vaskehaller</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h4>Næste ledige vaskehal:</h4>

      <h2 className="extra-bold">
        Vaskehal {availibleWashHall}
      </h2>
    </div>
  );
};

export default AvailibleWashingHall;