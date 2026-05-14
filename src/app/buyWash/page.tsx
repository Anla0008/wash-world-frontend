import ProgressBar from "@/components/global/grafik/ProgressBar";
import SingleWash from "@/components/vask/SingleWash";

const BuyWash = () => {
    return ( 
        <div>
            <ProgressBar activeIndex={1} isWashProcess={true} />
            <SingleWash />
        </div>
     );
}
 
export default BuyWash;