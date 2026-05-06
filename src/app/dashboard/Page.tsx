import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";

const Dashboard = () => {
    return ( 
        <>
            <ProgressBar activeIndex={1} />
            <Timer totalTime={120} />
        </>
     );
}
 
export default Dashboard;
 