"use client";

import { useRouter } from "next/navigation";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";

import Timer from "./Timer";
import ProgressBar from "../global/grafik/ProgressBar";

import { WaitForWashProps } from "@/types/washHallWaitTimeType";

import Image from "next/image";

const WaitForWash = ({
  activeIndex,
}: WaitForWashProps) => {
  const router = useRouter();

  // Læs den allerede gemte vaskehal fra store – aldrig re-fetch
  const availibleWashHall = useWashStore((s) => s.availibleWashHall);

  const { useEntryToWashHall } = useWash();
  const { entryTime } = useEntryToWashHall();

  if (!availibleWashHall) {
    return <p>Ingen ledig vaskehal valgt</p>;
  }

  return (
    <div>
      <ProgressBar
        activeIndex={activeIndex}
        isWashProcess={true}
        progress={entryTime ?? 0}
      />

      <h1 className="extra-bold">
        Kør ind i hal {availibleWashHall}
      </h1>

      <p>
        Vasken starter når du er kørt ind i
        vaskehallen.
      </p>

      <Image
        src={"/icons/vaskehal.svg"}
        alt="Vaskehal"
        width={500}
        height={500}
      />

      <div className="hidden">
        {entryTime !== null && (
          <Timer
            totalTime={entryTime}
            onComplete={() =>
              router.push("/activeWash")
            }
          />
        )}
      </div>
    </div>
  );
};

export default WaitForWash;