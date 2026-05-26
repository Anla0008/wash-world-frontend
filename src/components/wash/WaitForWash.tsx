"use client";

import { useRouter } from "next/navigation";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import { useNearestWash } from "@/lib/wash/resolvers";
import { useEffect } from "react";
import ProgressBar from "../global/grafik/ProgressBar";

import { WaitForWashProps } from "@/types/washType";

import Image from "next/image";

const WaitForWash = ({activeIndex,}: WaitForWashProps) => {

  const router = useRouter();
  const { nearestLocation } = useNearestWash();

  const availibleWashHall = useWashStore((s) => s.availibleWashHall);
  const setAvailibleWashHall = useWashStore((s) => s.setAvailibleWashHall);
  
  const { useEntryToWashHall, useAvailableWashHall } = useWash();

  const { hall, isLoading, error } = useAvailableWashHall(
    nearestLocation?.location_pk
  );

  useEffect(() => {
    if (hall && availibleWashHall === null) {
      setAvailibleWashHall(hall.car_wash_hall_number);
    }
  }, [hall, availibleWashHall, setAvailibleWashHall]);

  const hallNumber = availibleWashHall ?? hall?.car_wash_hall_number ?? null;
  
    const { registered } = useEntryToWashHall(hallNumber);

    useEffect(() => {
      if (registered) {
        router.push("/active-wash");
      }
    }, [registered, router]);

  if (isLoading && !hallNumber) {
    return <p>Finder ledig vaskehal...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!hallNumber) {
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