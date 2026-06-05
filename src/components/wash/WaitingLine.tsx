"use client";

import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/wash/Timer";
import { useWash } from "@/hooks/useWash";
import AvailibleWashingHall from "@/components/wash/AvailibleWashingHall";
import { useRouter } from "next/navigation";
import { useWashHall } from "@/components/global/washHallContext";
import { useWashStore } from "@/stores/useWashStore";
import { useEffect } from "react";

const WaitingLine = () => {
  const router = useRouter();
  const locationPk = useWashStore((state) => state.locationID);
  const { waitTimeByLocationPk, ensureWaitTimesForLocations } = useWashHall();

  useEffect(() => {
    if (!locationPk || locationPk === "undefined") return;
    ensureWaitTimesForLocations([locationPk]);
  }, [locationPk, ensureWaitTimesForLocations]);

  const waitTime = locationPk && locationPk !== "undefined" ? waitTimeByLocationPk[locationPk] : null;

  if (waitTime == null) {
    return <p>Henter ventetid...</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      <ProgressBar activeIndex={1} isWashProcess={true} />
      <h1 className="extra-bold">Følg din køstatus</h1>
      <Timer
        totalTime={waitTime}
        onComplete={() => router.push("/drive-in")}
      />
      <AvailibleWashingHall />
    </div>
  );
};

export default WaitingLine;
