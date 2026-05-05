"use client";
import Faq from "@/components/global/cards/FAQ";
import AbbonomenterCard from "@/components/global/cards/AbbonomenterCard";

export default function Favorites() {
  return (
    <div className="max-w-lg w-full flex flex-col gap-15">
      <Faq></Faq>
      <AbbonomenterCard></AbbonomenterCard>
    </div>
  );
}
