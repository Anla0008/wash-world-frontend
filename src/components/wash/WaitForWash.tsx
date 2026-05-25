"use client";

import { useRouter } from "next/navigation";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import { useEffect } from "react";
import ProgressBar from "../global/grafik/ProgressBar";

import { WaitForWashProps } from "@/types/washType";

import Image from "next/image";

const WaitForWash = ({
  activeIndex,
}: WaitForWashProps) => {
  const router = useRouter();

  // Læs den allerede gemte vaskehal fra store
  const availibleWashHall = useWashStore((s) => s.availibleWashHall);
  

  const { useEntryToWashHall } = useWash();
    const { registered } = useEntryToWashHall(availibleWashHall);

    useEffect(() => {
      if (registered) {
        router.push("/active-wash");
      }
    }, [registered, router]);

  if (!availibleWashHall) {
    return <p>Ingen ledig vaskehal valgt</p>;
  }

  return (
    <div>
      <ProgressBar activeIndex={activeIndex} isWashProcess={true}/>

      <h1 className="extra-bold">Kør ind i hal {availibleWashHall}</h1>

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