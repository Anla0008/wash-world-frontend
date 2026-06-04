"use client";

import { useRouter } from "next/navigation";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import { useNearestWash } from "@/lib/wash/resolvers";
import { useEffect } from "react";
import ProgressBar from "../global/grafik/ProgressBar";
import { WaitForWashProps } from "@/types/washType";
import Image from "next/image";

const WaitForWash = ({ activeIndex }: WaitForWashProps) => {
  const router = useRouter();
  const { useEntryToWashHall, useAvailableWashHall } = useWash();
  const { nearestLocation } = useNearestWash();

  const availibleWashHall = useWashStore((s) => s.availibleWashHall);
  const setAvailibleWashHall = useWashStore((s) => s.setAvailibleWashHall);

  const { hall, isLoading, error } = useAvailableWashHall(nearestLocation?.location_pk);

  // Hvis brugeren kommer direkte til drive-in (abonnement), sæt automatisk næste ledige hall.
  useEffect(() => {
    if (!hall || availibleWashHall !== null) return;
    setAvailibleWashHall(hall.car_wash_hall_number);
  }, [hall, availibleWashHall, setAvailibleWashHall]);

  const hallNumber = availibleWashHall;

  const { registered } = useEntryToWashHall(hallNumber);

  useEffect(() => {
    if (registered) {
      router.push("/active-wash");
    }
  }, [registered, router]);

  if (!hallNumber) {
    if (isLoading) {
      return <p>Finder ledig vaskehal...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    return <p>Ingen ledig vaskehal valgt</p>;
  }

  return (
    <div>
      <ProgressBar activeIndex={activeIndex} isWashProcess={true}/>

      <h1 className="extra-bold">Kør ind i hal {hallNumber}</h1>

      <p>Vasken starter når du er kørt ind i vaskehallen.</p>

      <Image
        src={"/icons/vaskehal.svg"}
        alt="Vaskehal"
        width={500}
        height={500}
      />

      <p>Registrerer bil i vaskehal...</p>

    </div>
  );
}

export default WaitForWash;