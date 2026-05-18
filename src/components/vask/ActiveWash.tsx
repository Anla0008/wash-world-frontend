"use client";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import { useRouter } from "next/navigation";
import Timer from "@/components/vask/Timer";

const ActiveWash = () => {
    const router = useRouter();

    return ( 

        <div className="flex flex-col gap-12">
            <ProgressBar activeIndex={2} isWashProcess={true} />
            <h1 className="extra-bold">Følg din vask</h1>
            <Timer totalTime={120} onComplete={() => router.push("/reciept")} />
        </div>
     );
}
 
export default ActiveWash;