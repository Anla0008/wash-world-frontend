"use client";

import HistorikCard from "@/components/profil/HistoryCard";
import { useWash } from "@/hooks/useWash";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";

import { useRouter } from "next/navigation";

export default function WashHistory() {
  const { useWashHistory } = useWash();

  const history = useWashHistory("3"); // TODO: Skift til JWT bruger
  const router = useRouter();

  return (
    <div>
      <ArrowLeft onClick={() => router.push("/profil")} size={30} />
      <h1 className="extra-bold">Vaskehistorik</h1>
      <div className="flex flex-col gap-3">
        {history.map((wash: any) => (
          <HistorikCard key={wash.car_wash_history_pk} location={wash.location_name} date={new Date(wash.date_of_wash).toLocaleDateString("da-DK")} description={wash.car_wash_type} price={wash.car_wash_price} points={wash.car_wash_price} href="/car-wash-history" />
        ))}
      </div>
    </div>
  );
}
