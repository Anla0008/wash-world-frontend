"use client";

import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/wash/Timer";
import AvailibleWashingHall from "@/components/wash/AvailibleWashingHall";
import { useRouter } from "next/navigation";
import { useWashHall } from "@/components/global/washHallContext";
import { useWashStore } from "@/stores/useWashStore";

const WaitingLine = () => {

  const router = useRouter();
  const locationPk = useWashStore((state) => state.locationID);
  const { waitTimeByLocationPk } = useWashHall();

  const waitTime = locationPk && locationPk !== "undefined" ? waitTimeByLocationPk[locationPk] : null;

  if (waitTime == null) {
    return <p>Henter ventetid...</p>;
  }


  const handleTimerComplete = () => {
    router.push("/drive-in");
  }

  return (
    <div className="flex flex-col gap-5">
      <ProgressBar activeIndex={1} isWashProcess={true} />
      <h1 className="extra-bold">Følg din køstatus</h1>
      <Timer
        totalTime={waitTime}
        onComplete={handleTimerComplete}
      />
      <AvailibleWashingHall />
    </div>
  );
};

export default WaitingLine;
