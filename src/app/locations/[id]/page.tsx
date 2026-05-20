"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";

import PracticInfoCarwash from "@/components/singleview/PracticInfoCarwash";
import PracticInfoHeight from "@/components/singleview/PracticInfoHeight";
import PracticInfoPrewash from "@/components/singleview/PracticInfoPrewash";
import PracticInfoTime from "@/components/singleview/PracticInfoTime";
import PracticInfoVacuumCleaner from "@/components/singleview/PracticInfoVacuumCleaner";
import PracticInfoWashSelf from "@/components/singleview/PracticInfoWashSelf";
import TravlhedGraf from "@/components/singleview/TravlhedGraf";

export default function SingleLocationPage() {
  const { id } = useParams();
  const { getSingleLocation } = useAuth();

  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLocation() {
      try {
        const data = await getSingleLocation(id as string);

        console.log("Single location data:", data);

        setLocation(data || null);
      } catch (error) {
        console.error("Der skete en fejl ved hentning af location:", error);
        setLocation(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadLocation();
    }
  }, [getSingleLocation, id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-foreground">
        <p>Indlæser vaskehal...</p>
      </main>
    );
  }

  if (!location) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-foreground">
        <p>Vaskehallen blev ikke fundet.</p>

        <Link href="/locations" className="mt-4 inline-block underline">
          Tilbage til kortet
        </Link>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-background px-8 pb-28 pt-10 text-foreground">
      <header className="mb-24 flex items-center justify-between">
        <Link href="/locations" aria-label="Tilbage til kortet">
          <ArrowLeft size={24} />
        </Link>
      </header>

      <section className="mb-14">
        <h1 className="mb-8 text-4xl font-extrabold">{location.location_city}</h1>

        <Image src={location.location_img} alt={`Wash World ${location.location_city}`} width={600} height={350} className="mb-7 h-56 w-full object-cover" />

        <div className="mb-3 flex items-center gap-3">
          <Clock size={22} />
          <p>07 - 22</p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <MapPin size={22} />
          <p>
            {location.location_address}, {location.location_city}
          </p>
        </div>

        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.location_address}, ${location.location_city}`)}`} target="_blank" rel="noopener noreferrer" className="mx-auto block w-fit bg-[linear-gradient(120deg,var(--brand-green),var(--gray-5))] px-8 py-3 font-extrabold text-(--foregroud-reverse)]">
          Find vej
        </a>
      </section>

      <section className="mb-20">
        <h2 className="mb-8 text-3xl font-extrabold">Travlhed i {location.location_city}</h2>
        <TravlhedGraf status="travl" /> {/* Hardcoded status for at vise grafen, skal senere være dynamisk baseret på location */}
      </section>

      <section className="mb-20">
        <h2 className="mb-8 text-3xl font-extrabold">Praktisk info</h2>

        <div className="grid grid-cols-2 gap-6">
          <PracticInfoHeight />

          <PracticInfoTime />

          {Number(location.car_wash_self) > 0 && <PracticInfoWashSelf car_wash_self={location.car_wash_self ?? 0} />}

          {Number(location.car_wash_high_pressure) > 0 && <PracticInfoPrewash car_wash_high_pressure={location.car_wash_high_pressure ?? 0} />}

          {Number(location.car_wash_vacuum) > 0 && <PracticInfoVacuumCleaner car_wash_vacuum={location.car_wash_vacuum ?? 0} />}

          <PracticInfoCarwash car_wash_hall_number={location.car_wash_hall_number ?? 0} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-3xl font-extrabold">Bilvask {location.location_city}</h2>

        {location.car_wash_text ? (
          <p className="leading-relaxed">{location.car_wash_text}</p>
        ) : (
          <div className="space-y-6 leading-relaxed">
            <p>
              På {location.location_address} i {location.location_city} finder du Wash World. Her kan du nemt vaske din bil, når det passer dig.
            </p>

            <p>Det er hurtigt og enkelt at vaske din bil hos Wash World. Som medlem kan du køre bilen i vaskehallen, når det passer dig.</p>
          </div>
        )}
      </section>
    </main>
  );
}
