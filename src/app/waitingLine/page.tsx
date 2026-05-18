"use client";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";
import { useWash } from "@/hooks/useWash";
import AvailibleWashingHall from "@/components/vask/AvailibleWashingHall";
import { useRouter } from "next/navigation";

const WaitingLine = () => {
    const router = useRouter();
    const { useWashHallWaitTime } = useWash();
    const { waitTime } = useWashHallWaitTime();

    return (
        <div className="flex flex-col gap-5">
            <ProgressBar activeIndex={1} isWashProcess={true} />
            <h1 className="extra-bold">Følg din køstatus</h1>
            <Timer totalTime={waitTime ?? 0} onComplete={() => router.push("/driveIn")} />
            <AvailibleWashingHall />
        </div>
     );
}
 
export default WaitingLine;