"use client";

import ProgressBar from "@/components/global/grafik/ProgressBar";
import { useRouter } from "next/navigation";
import Timer from "@/components/wash/Timer";
import { useWashStore } from "@/stores/useWashStore";
import { useEffect, useState } from "react";
import { useWash } from "@/hooks/useWash";
import { washData } from "@/mockupData/washData";

const ActiveWash = () => {
  const router = useRouter();

  const { selectedWash, startedAt, setStartedAt, setEndedAt } = useWashStore();

  // ===========================================================
  //                DURATION EFTER SUB
  // ===========================================================

  const { hasSub } = useWash();

  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);

  const [userHasSub, setUserHasSub] = useState(false);


  // tjekker om bruger har sub og hvilken type
  useEffect(() => {
    const checkSub = async () => {const result = await hasSub(); 
      setUserHasSub(result.has_sub);
      setSubscriptionType(result.sub_type);
    };
  
    checkSub();
  }, [hasSub]);

  // finder den valgte vask i mockup data for at få duration til timer
  const subscriptionWash = washData.types.find((wash) => wash.name === subscriptionType);

  // hvis bruger har sub, brug duration fra sub, ellers brug duration fra valgt vask
  const timerDuration = userHasSub ? subscriptionWash?.duration : selectedWash?.duration;

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
