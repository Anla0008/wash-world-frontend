"use client";

import ProgressBar from "@/components/global/grafik/ProgressBar";
import { useRouter } from "next/navigation";
import Timer from "@/components/wash/Timer";
import { useWashStore } from "@/stores/useWashStore";
import { useEffect } from "react";

const ActiveWash = () => {
  const router = useRouter();

  const { selectedWash, startedAt, setStartedAt, setEndedAt } = useWashStore();

  // ===========================================================
  //                  START TIDSPUNKT FOR VASK
  // ===========================================================

  useEffect(() => {
    if (!selectedWash || startedAt) return;

    const now = Date.now();

    setStartedAt(now);

    setEndedAt(now);
  }, [selectedWash, startedAt, setStartedAt, setEndedAt]);

  return (
    <div className="flex flex-col gap-12">
      <ProgressBar activeIndex={2} isWashProcess={true} />

      <h1 className="extra-bold">Følg din vask</h1>

      <Timer totalTime={selectedWash?.duration ?? 0} onComplete={() => router.push("/reciept")} />
    </div>
  );
};

export default ActiveWash;
