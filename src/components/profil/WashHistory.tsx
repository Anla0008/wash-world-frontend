"use client";

import HistoryCard from "@/components/profil/HistoryCard";
import { useWashHistory } from "@/hooks/useWash";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import Link from "next/link";

export default function WashHistory() {
  const { data: history = [], isLoading } = useWashHistory();

  if (isLoading) return <p>Indlæser...</p>;

  return (
    <div>
      <Link href="/profil" className="flex items-center gap-2 mb-4">
        <ArrowLeft size={24} />
        Profil
      </Link>
      <h1 className="extra-bold">Vaskehistorik</h1>
      <div className="flex flex-col gap-3">
        {history?.length > 0 ? (
          history.map((wash: any) => {
            const startDate = new Date(wash.date_of_wash * 1000); // new Date() forventer millisekunder, så gang med 1000, da Epoch/Unix er sekunder
            return <HistoryCard key={wash.car_wash_history_pk} location={wash.location_name} date={startDate.toLocaleDateString("da-DK")} description={wash.car_wash_type} price={wash.car_wash_price} points={wash.car_wash_price} href={`/wash-history/${wash.car_wash_history_pk}`} />;
          })
        ) : (
          <p>Du har endnu ikke foretaget nogen vask</p>
        )}
      </div>
    </div>
  );
}
