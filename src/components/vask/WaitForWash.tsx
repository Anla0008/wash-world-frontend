"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWash } from "@/hooks/useWash";
import { generateAvailibleWashHalls } from "@/lib/wash/resolvers";
import Timer from "./Timer";
import ProgressBar from "../global/grafik/ProgressBar";
import { WaitForWashProps } from "@/types/washHallWaitTimeType";
import Image from "next/image";

const WaitForWash = ({ activeIndex }: WaitForWashProps) => {
  const router = useRouter();

  const [availableWashHall] = useState(() =>
    generateAvailibleWashHalls()
  );

  const { useWashHallWaitTime } = useWash();

  const { waitTime } = useWashHallWaitTime();

  return (
    <div>
      <ProgressBar
        activeIndex={activeIndex}
        isWashProcess={true}
        progress={waitTime ?? 0}
      />

      <h1 className="extra-bold">
        Kør ind i hal {availableWashHall}
      </h1>

      <p>
        Vasken starter når du er kørt ind i vaskehallen.
      </p>
      <Image src={"/icons/vaskehal.svg"} alt="Vaskehal" width={500} height={500} />

      {/* // Timeren er skjult, da den kun skal bruges til at navigere videre, når tiden er gået. */}
      <div className="hidden">
      {waitTime !== null && (
        <Timer totalTime={waitTime} onComplete={() => router.push("/activeWash")} />
      )}
      </div>
    </div>
  );
};

export default WaitForWash;