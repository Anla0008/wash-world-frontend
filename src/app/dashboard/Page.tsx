import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";
import Smileys from "@/components/global/icons/grafik/Smileys";
import KundeserviceCard from "@/components/global/cards/KundeserviceCard";
import TravlhedGraf from "@/components/singleview/TravlhedGraf";
import ProfilOplysningerWrapper from "@/components/profil/ProfilOplysningerWrapper";
const Dashboard = () => {
    return ( 
        <>
            <ProgressBar activeIndex={1} />
            <Timer totalTime={120} />
            <Smileys />
            <KundeserviceCard />
            <TravlhedGraf status="travl" />
            <ProfilOplysningerWrapper />
        </>
     );
}
 
export default Dashboard;
 