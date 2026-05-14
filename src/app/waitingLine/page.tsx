"use client";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";
import { getRandomWaitTime, useWashProgress } from "@/hooks/useWash";
import { useWashHall } from "@/hooks/useWash";
import { useState } from "react";

const WaitingLine = () => {
    const [totalTime] = useState(() => getRandomWaitTime());
    const { washHalls } = useWashHall();
    const { progress, formattedTime } = useWashProgress(totalTime);

    return (
        <div className="flex flex-col gap-5">
            <ProgressBar activeIndex={1} isWashProcess={true} progress={progress} />
            <Timer totalTime={totalTime} progress={progress} formattedTime={formattedTime} />
            <div className="flex flex-col items-center justify-center extra-bold">
                <h4>Næste ledige vaskehal:</h4>
                <h2>Vaskehal 2</h2>
            </div>
            {washHalls.filter((wash) => !wash.is_broken).map((wash) => (
                <li key={wash.car_wash_pk}>{wash.car_wash_hall_number}</li>
            ))}
        </div>
     );
}
 
export default WaitingLine;