import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";

const WaitingLine = () => {
    return (
        <div className="flex flex-col gap-5">
            <ProgressBar activeIndex={1} isWashProcess={true} />
            <Timer totalTime={120} />
            <div className="flex flex-col items-center justify-center extra-bold">
                <h4>Næste ledige vaskehal:</h4>
                <h2>Vaskehal 2</h2>
            </div>
        </div>
     );
}
 
export default WaitingLine;