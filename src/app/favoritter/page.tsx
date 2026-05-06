"use client";
import Faq from "@/components/global/cards/FAQ";
import AbbonomenterCard from "@/components/global/cards/AbbonomenterCard";
import HistorikCard from "@/components/global/cards/HistorikCard";
import PointBadge from "@/components/global/grafik/PointBadge";

export default function Favorites() {
  return (
    <div className="max-w-lg w-full flex flex-col gap-15">
      <Faq></Faq>
      <AbbonomenterCard></AbbonomenterCard>
      <HistorikCard></HistorikCard>
      <PointBadge points={15}></PointBadge>
    </div>
  );
}
