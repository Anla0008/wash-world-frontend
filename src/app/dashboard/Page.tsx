import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";
import Smileys from "@/components/global/icons/grafik/Smileys";

const Dashboard = () => {
    return ( 
        <>
            <ProgressBar activeIndex={1} />
            <Timer totalTime={120} />
            <Smileys />
        </>
     );
}
 
export default Dashboard;
 