"use client";

// Imports fra next/react
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Henter funktioner osv.
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import { resolveWaitStatus, resolveWaitTime } from "@/lib/wash/resolvers";
import { washHallWaitTime } from "@/mockupData/washData";

// Components fra mappen
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import Clock from "@/components/global/icons/grafik/Clock";
import LocationPin from "@/components/global/icons/grafik/Location";
import PrimaryButtonAnchorTag from "@/components/global/buttons/anchortag/PrimaryButtonAnchorTag";
import PracticInfoCarwash from "@/components/singleview/PracticInfoCarwash";
import PracticInfoHeight from "@/components/singleview/PracticInfoHeight";
import PracticInfoPrewash from "@/components/singleview/PracticInfoPrewash";
import PracticInfoTime from "@/components/singleview/PracticInfoTime";
import PracticInfoVacuumCleaner from "@/components/singleview/PracticInfoVacuumCleaner";
import PracticInfoWashSelf from "@/components/singleview/PracticInfoWashSelf";
import BusinessGraph from "@/components/singleview/BusinessGraph";

export default function LocationSingle() {
  // Henter det dynamiske id-segment fra URL
  const { id } = useParams();

  // Henter funktion til at fetche én lokation fra auth
  const { getSingleLocation } = useAuth();

  // State til at gemme lokationens data – null indtil data er hentet
  const [location, setLocation] = useState<Location | null>(null);

  // Styrer loading-tilstand
  const [isLoading, setIsLoading] = useState(true);

  // Udregner ventetid i sekunder baseret på mockup-data
  const waitTimeSeconds = resolveWaitTime(washHallWaitTime);

  // Tjekker om vaskehallen is_broken – false hvis location ikke er loaded
  const isBroken = location?.is_broken ?? false;

  // Oversætter ventetid + fejlstatus til visuel status
  const status = resolveWaitStatus(waitTimeSeconds, isBroken);

  useEffect(() => {
    async function loadLocation() {
      try {
        // Fetcher lokationsdata fra API med id'et fra URL'en
        const data = await getSingleLocation(id as string);
        console.log("Single location data:", data);

        // Gemmer data i state og sætter null hvis intet returneres
        setLocation(data || null);
      } catch (error) {
        // Ved fejl sættes til null så fejl-UI vises
        console.error("Der skete en fejl ved hentning af location:", error);
        setLocation(null);
      } finally {
        // Slår altid loading fra, uanset om fetch lykkedes eller fejlede
        setIsLoading(false);
      }
    }

    // Fetch kun hvis id er tilgængeligt
    if (id) {
      loadLocation();
    }
  }, [getSingleLocation, id]); // Kører igen hvis id eller getSingleLocation ændrer sig

  // Viser loading-tekst mens data hentes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10 text-foreground">
        <p>Indlæser vaskehal...</p>
      </div>
    );
  }

  // Viser fejl-UI hvis lokationen ikke blev fundet eller fetch fejlede
  if (!location) {
    return (
      <div className="min-h-screen bg-background py-10 text-foreground">
        <p>Vaskehallen blev ikke fundet.</p>
        <Link href="/locations" className="mt-4 inline-block underline">
          Tilbage til kortet
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      {/* ================== HERO SECTION =================== */}
      <section>
        
         <Link href="/locations" className="flex items-center gap-2 mb-4">
            <ArrowLeft size={24} />
              Kort
            </Link>

        <h1 className="my-8 extra-bold">{location.location_city}</h1>

        <Image
          src={location.location_img}
          alt={`Wash World ${location.location_city}`}
          width={600}
          height={350}
          className="mb-7 h-56 w-full object-cover"
        />

        <div className="mb-3 flex items-center gap-3">
          <Clock size={22} />
          <p>07 - 22</p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <LocationPin size={22} />
          <p>
            {location.location_address}, {location.location_city}
          </p>
        </div>

        <div className="flex justify-center">
          <PrimaryButtonAnchorTag
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.location_address}, ${location.location_city}`)}`}
            target="_blank"
          >
            Find vej
          </PrimaryButtonAnchorTag>
        </div>
      </section>

      {/* ================== TRAVLHED I VASKEHAL =================== */}
      <section>
        <h2 className="mb-8 text-3xl font-extrabold">
          Travlhed i {location.location_city}
        </h2>
        <BusinessGraph status={status} />{" "}
        {/* Hardcoded status for at vise grafen, skal senere være dynamisk baseret på location */}
      </section>

      {/* ====================== PRAKTISK INFO ====================== */}
      <section>
        <h2 className="extra-bold">Praktisk info</h2>

        <div className="grid grid-cols-2 gap-6">
          <PracticInfoHeight />

          <PracticInfoTime />

          {Number(location.car_wash_self) > 0 && (
            <PracticInfoWashSelf car_wash_self={location.car_wash_self ?? 0} />
          )}

          {Number(location.car_wash_high_pressure) > 0 && (
            <PracticInfoPrewash
              car_wash_high_pressure={location.car_wash_high_pressure ?? 0}
            />
          )}

          {Number(location.car_wash_vacuum) > 0 && (
            <PracticInfoVacuumCleaner
              car_wash_vacuum={location.car_wash_vacuum ?? 0}
            />
          )}

          <PracticInfoCarwash
            car_wash_hall_number={location.car_wash_hall_number ?? 0}
          />
        </div>
      </section>

      {/* ===================== BESKRIVENDE TEKST ===================== */}
      <section>
        <h2 className="extra-bold">Bilvask {location.location_city}</h2>

        {location.car_wash_text ? (
          <p className="leading-relaxed">{location.car_wash_text}</p>
        ) : (
          <div className="space-y-6 leading-relaxed">
            <p>
              På {location.location_address} i {location.location_city} finder
              du Wash World. Her kan du nemt vaske din bil, når det passer dig.
            </p>

            <p>
              Det er hurtigt og enkelt at vaske din bil hos Wash World. Som
              medlem kan du køre bilen i vaskehallen, når det passer dig.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
