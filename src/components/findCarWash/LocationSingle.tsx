"use client";

// Next / React
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Hooks, types og helpers
import { useAuth } from "@/hooks/useAuth";
import { Location } from "@/types/locations";
import { useWashHall } from "@/hooks/washHallContext";
import { resolveWaitStatusLabel } from "@/lib/wash/waitTime";

// Components
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

// ===========================================================
//                         CONSTANTS
// ===========================================================

const DEFAULT_OPENING_HOURS = "07 - 22";

// ===========================================================
//                    OPENING HOURS LOGIC
// ===========================================================

// Finder åbningstider for lokationen.
// Der tjekkes flere felter, fordi data kan komme fra forskellige steder/formater.
function resolveOpeningHours(location: Location) {
  if (location.opening_hours) {
    return location.opening_hours;
  }

  if (location.openingHours) {
    return location.openingHours;
  }

  if (location.location_opening_hours) {
    return location.location_opening_hours;
  }

  if (location.open_from && location.open_to) {
    return `${location.open_from} - ${location.open_to}`;
  }

  return DEFAULT_OPENING_HOURS;
}

// ===========================================================
//                       COMPONENT START
// ===========================================================

export default function LocationSingle() {
  // ===========================================================
  //                         URL ID LOGIC
  // ===========================================================

  // Henter id'et fra URL'en, fx /locations/3.
  const { id } = useParams();

  // Gør id'et sikkert at bruge.
  // Hvis id ikke er en string, bruger vi null.
  const locationId = typeof id === "string" ? id : null;

  // ===========================================================
  //                    LOCATION DATA LOGIC
  // ===========================================================

  const { getSingleLocation } = useAuth();

  // Gemmer den lokation, der bliver hentet fra backend.
  const [location, setLocation] = useState<Location | null>(null);

  // Bruges til at vise loading, mens lokationen bliver hentet.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!locationId) return;

    const idToFetch = locationId;

    async function loadLocation() {
      try {
        const data = await getSingleLocation(idToFetch);

        setLocation(data || null);
      } catch (error) {
        console.error("Der skete en fejl ved hentning af location:", error);

        setLocation(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadLocation();
  }, [getSingleLocation, locationId]);

  // ===========================================================
  //                       WAIT TIME LOGIC
  // ===========================================================

  const { waitTimeByLocationPk, ensureWaitTimesForLocations } = useWashHall();

  // Henter ventetid for den lokation, der vises på siden.
  useEffect(() => {
    if (!locationId) return;

    ensureWaitTimesForLocations([locationId]);
  }, [locationId, ensureWaitTimesForLocations]);

  const waitTimeForLocation = locationId ? waitTimeByLocationPk[locationId] : null;

  let waitStatus = null;

  if (waitTimeForLocation != null) {
    waitStatus = resolveWaitStatusLabel(waitTimeForLocation);
  }

  // ===========================================================
  //                    LOADING / ERROR UI
  // ===========================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10 text-foreground">
        <p>Indlæser vaskehal...</p>
      </div>
    );
  }

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

  if (!waitStatus) {
    return (
      <div className="min-h-screen bg-background py-10 text-foreground">
        <p>Indlæser ventetid...</p>
      </div>
    );
  }

  // ===========================================================
  //                       DISPLAY VALUES
  // ===========================================================

  const openingHours = resolveOpeningHours(location);

  // Teksten der skal søges efter på Google Maps.
  const googleMapsSearch = `${location.location_address}, ${location.location_city}`;

  // Link til Google Maps baseret på lokationens adresse og by.
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsSearch)}`;

  // Gør JSX'en mere læsbar ved at gemme disse tjek i variabler.
  const hasSelfWash = Number(location.car_wash_self) > 0;
  const hasPrewash = Number(location.car_wash_high_pressure) > 0;
  const hasVacuumCleaner = Number(location.car_wash_vacuum) > 0;

  // ===========================================================
  //                         RENDER
  // ===========================================================

  return (
    <div className="flex flex-col gap-20">
      {/* ================== HERO SECTION =================== */}
      <section>
        <Link href="/locations" className="flex items-center gap-2 mb-4">
          <ArrowLeft size={24} />
          Kort
        </Link>

        <h1 className="my-8 extra-bold">{location.location_city}</h1>

        <Image src={location.location_img} alt={`Wash World ${location.location_city}`} width={600} height={350} className="mb-7 h-56 w-full object-cover" />

        <div className="mb-3 flex items-center gap-3">
          <Clock size={22} />
          <p>{openingHours}</p>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <LocationPin size={22} />
          <p>
            {location.location_address}, {location.location_city}
          </p>
        </div>

        <div className="flex justify-center">
          <PrimaryButtonAnchorTag href={googleMapsUrl} target="_blank">
            Find vej
          </PrimaryButtonAnchorTag>
        </div>
      </section>

      {/* ================== TRAVLHED I VASKEHAL =================== */}
      <section>
        <h2 className="mb-8 text-3xl font-extrabold">Travlhed i {location.location_city}</h2>

        <BusinessGraph locationPk={location.location_pk} openingHours={openingHours} />
      </section>

      {/* ====================== PRAKTISK INFO ====================== */}
      <section>
        <h2 className="extra-bold">Praktisk info</h2>

        <div className="grid grid-cols-2 gap-6">
          <PracticInfoHeight />

          <PracticInfoTime />

          {hasSelfWash && <PracticInfoWashSelf car_wash_self={location.car_wash_self ?? 0} />}

          {hasPrewash && <PracticInfoPrewash car_wash_high_pressure={location.car_wash_high_pressure ?? 0} />}

          {hasVacuumCleaner && <PracticInfoVacuumCleaner car_wash_vacuum={location.car_wash_vacuum ?? 0} />}

          <PracticInfoCarwash car_wash_hall_number={location.car_wash_hall_number ?? 0} />
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
              På {location.location_address} i {location.location_city} finder du Wash World. Her kan du nemt vaske din bil, når det passer dig.
            </p>

            <p>Det er hurtigt og enkelt at vaske din bil hos Wash World. Som medlem kan du køre bilen i vaskehallen, når det passer dig.</p>
          </div>
        )}
      </section>
    </div>
  );
}
