"use client";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";
import { useWash } from "@/hooks/useWash";
import AvailibleWashingHall from "@/components/vask/AvailibleWashingHall";
import { useState } from "react";

const WaitingLine = () => {
    const { getRandomWaitTime, useWashProgress } = useWash();
    const [totalTime] = useState(() => getRandomWaitTime());
    const { progress, formattedTime } = useWashProgress(totalTime);

    return (
        <div className="flex flex-col gap-5">
            <ProgressBar activeIndex={1} isWashProcess={true} progress={progress} />
            <h1 className="extra-bold">Følg din køstatus</h1>
            <Timer totalTime={totalTime} progress={progress} formattedTime={formattedTime} />
            <AvailibleWashingHall />
        </div>
     );
}
 
export default WaitingLine;