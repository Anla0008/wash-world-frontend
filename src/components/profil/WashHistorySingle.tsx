"use client";

import PointBadge from "@/components/global/grafik/PointBadge";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import { useWashDetail } from "@/hooks/useWash";
import { use } from "react";
import Link from "next/link";

export default function WashHistorySingle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: wash, isLoading } = useWashDetail(id);

  if (isLoading) return <p>Indlæser...</p>;
  if (!wash) return <p>Vask ikke fundet</p>;

  const startDate = new Date(wash.car_wash_started_at);
  const endDate = new Date(wash.car_wash_ended_at);

  return (
    <div className="flex flex-col gap-10">
      <Link href="/profil" className="flex items-center gap-2 mb-4">
        <ArrowLeft size={24} />
        Vaskehistorik
      </Link>

      <div className="flex flex-col">
        <h1 className="extra-bold">{startDate.toLocaleDateString("da-DK")}</h1>
        <p>Tak fordi du vasker hos os!</p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="extra-bold">Din vask</h2>

        <div className="flex gap-2">
          <p className="extra-bold">Dato:</p>
          <p>{startDate.toLocaleDateString("da-DK")}</p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">Starttidspunkt:</p>
          <p>
            {startDate.toLocaleTimeString("da-DK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">Sluttidspunkt:</p>
          <p>
            {endDate.toLocaleTimeString("da-DK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">Vasktype:</p>
          <p>{wash.car_wash_type}</p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">Pris:</p>
          <p>{wash.car_wash_price} kr.</p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">Lokation:</p>
          <p>
            Hal {wash.car_wash_hall_fk} - {wash.location_name}
          </p>
        </div>
      </div>

      <div className="flex justify-end mr-10">
        <PointBadge points={wash.car_wash_price} />
      </div>
    </div>
  );
}
