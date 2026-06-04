"use client";

import ProgressBar from "@/components/global/grafik/ProgressBar";
import { useRouter } from "next/navigation";
import Timer from "@/components/wash/Timer";
import { useWashStore } from "@/stores/useWashStore";
import { useEffect } from "react";
import { washData } from "@/mockupData/washData";
import { useSubscriptionStatus } from "@/lib/wash/resolvers";

const ActiveWash = () => {
  const router = useRouter();

  const userHasSub = useSubscriptionStatus();

  const { selectedWash, startedAt, setSelectedWash, setStartedAt, setEndedAt } = useWashStore();

  // ===========================================================
  //                DURATION EFTER SUB
  // ===========================================================

  // finder abonnementsvasken via sub_type, så receipt får en selectedWash i sub-flow
  const normalizedSubType = userHasSub.subType?.trim().toLowerCase();
  const subscriptionWash = washData.types.find((wash) => wash.name.trim().toLowerCase() === normalizedSubType);

  // hvis bruger har sub, brug duration fra sub, ellers brug duration fra valgt vask
  const timerDuration = userHasSub.hasSub ? subscriptionWash?.duration : selectedWash?.duration;

  useEffect(() => {
    if (!userHasSub.hasSub || !subscriptionWash) return;
    if (selectedWash?.name === subscriptionWash.name) return;

    setSelectedWash(subscriptionWash);
  }, [userHasSub.hasSub, selectedWash?.name, setSelectedWash, subscriptionWash]);

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

      <Timer totalTime={timerDuration ?? 0} onComplete={() => router.push("/reciept")} />
    </div>
  );
};

export default ActiveWash;