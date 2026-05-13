import ProgressBar from "@/components/global/grafik/ProgressBar";
import Timer from "@/components/vask/Timer";
import Smileys from "@/components/global/icons/grafik/Smileys";
import KundeserviceCard from "@/components/global/cards/KundeserviceCard";
import TravlhedGraf from "@/components/singleview/TravlhedGraf";
import ProfilOplysningerWrapper from "@/components/profil/ProfilOplysningerWrapper";
import FilterProgressBar from "@/components/global/filtering/FilterProgressBar";
const Dashboard = () => {
    return ( 
        <>
            <ProgressBar activeIndex={2} isWashProcess={true} />
            <Timer totalTime={120} />
            <Smileys />
            <KundeserviceCard />
            <TravlhedGraf status="travl" />
            <ProfilOplysningerWrapper />
            <FilterProgressBar/>
        </>
     );
}
 
export default Dashboard;
 