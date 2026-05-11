import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";
import Smileys from "@/components/global/icons/grafik/Smileys";
import KundeserviceCard from "@/components/global/cards/KundeserviceCard";
import PointCard from "@/components/global/cards/PointCard";
const Dashboard = () => {
    return ( 
        <>
            <ProgressBar activeIndex={1} />
            <Timer totalTime={120} />
            <Smileys />
            <KundeserviceCard />
            {/* opdateres senere til at passe med usewash systemet */}
            <PointCard points={155} />
        </>
     );
}
 
export default Dashboard;
 