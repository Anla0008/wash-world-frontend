"use client";
import Faq from "@/components/global/cards/FAQ";
import AbbonomenterCard from "@/components/global/cards/AbbonomenterCard";
import HistorikCard from "@/components/profil/HistorikCard";
import PracticInfoCarwash from "@/components/singleview/PracticInfoCarwash";
import PracticInfoHeight from "@/components/singleview/PracticInfoHeight";
import PracticInfoTime from "@/components/singleview/PracticInfoTime";
import PracticInfoPrewash from "@/components/singleview/PracticInfoPrewash";
import PracticInfoVacuumCleaner from "@/components/singleview/PracticInfoVacuumCleaner";
import PracticInfoWashSelf from "@/components/singleview/PracticInfoWashSelf";
import VaskehalCard from "@/components/global/cards/VaskehalCard";

export default function Favorites() {
  return (
    <div className="max-w-lg w-full flex flex-col gap-15">
      <Faq></Faq>
      <AbbonomenterCard></AbbonomenterCard>
      <HistorikCard
        location="Højbjerg"
        date="12-01-2026"
        description="Brilliant"
        price={189}
        points={15}
        href={`/historik/1`}
      />{" "}
      {/* skal laves dynamisk med ${wash.id} */}
      <section className="grid grid-cols-2 gap-4">
        <PracticInfoCarwash car_wash_hall_number={2} />
        <PracticInfoHeight></PracticInfoHeight>
        <PracticInfoTime></PracticInfoTime>
        <PracticInfoPrewash></PracticInfoPrewash>
        <PracticInfoVacuumCleaner
          car_wash_vacuum={2}
        ></PracticInfoVacuumCleaner>
        <PracticInfoWashSelf car_wash_self={2}></PracticInfoWashSelf>
        <VaskehalCard
          city="Højbjerg"
          address="Bjødstrupvej 20E, 8270 Højbjerg"
          openingHours="07 - 22"
          status="Kort ventetid"
          image="/images/washworld.jpg"
          href="/vaskehaller/hojbjerg"
        />{" "}
      </section>
    </div>
  );
}
