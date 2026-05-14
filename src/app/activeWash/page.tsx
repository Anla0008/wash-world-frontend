"use client";
import ProgressBar from "@/components/global/grafik/ProgressBar";

import Timer from "@/components/vask/Timer";
import { washProgressConfig } from "@/lib/wash/config";

const Wash = () => {
    return ( 
        <div className="flex flex-col gap-12">
            <ProgressBar activeIndex={washProgressConfig["/activeWash"]} isWashProcess={true} />
            <Timer totalTime={120} />
            
        </div>
     );
}
 
export default Wash;