"use client";

import { useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useWashHall } from "@/components/global/washHallContext";
import { resolveWaitStatusLabel } from "@/lib/wash/waitTime";
import { waitTimeMockup } from "@/mockupData/washData";
import ArrowLeft from "../global/icons/navigation/ArrowLeft";
import ArrowRight from "../global/icons/navigation/ArrowRight";
import Validated from "../global/icons/validation/Validated";
import Error from "../global/icons/validation/Error";

const GRAPH_MAX_BAR_HEIGHT = 100;
const DEFAULT_OPENING_HOURS = "07 - 22";
type GraphStatus = "travl" | "moderat" | "rolig";

//////////////////////////////////////////////
          // ÅBNINGSTIDER//
//////////////////////////////////////////////

// formater tiden til "HH:00" og sørg for at det er et gyldigt tidspunkt mellem 00:00 og 23:00
const formatHourLabel = (date: Date) => `${String(date.getHours()).padStart(2, "0")}:00`;

// normaliser input for åbningstider, så vi kan parse det konsekvent, selvom det kommer i forskellige formater
const normalizeHour = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})(?::\d{2})?$/);

  if (!match) return null;

  // hvis der er et match, prøv at parse det første capture group som et heltal (timer)
  const hour = Number(match[1]);
  // tjek om det parsed time er et gyldigt klokkeslæt (0-23)
  return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : null;
};

// parse åbningstider i forskellige formater og returner et konsistent objekt med openHour og closeHour
const parseOpeningHourRange = (openingHours: string) => {
  // prøv at finde mønsteret "HH - HH" eller "HH:MM - HH:MM" i åbningstiderne
  const match = openingHours.match(/(\d{1,2}(?::\d{2})?)\s*-\s*(\d{1,2}(?::\d{2})?)/);

  // hvis mønsteret ikke matcher, returner standard åbningstider (pre-defineret)
  if (!match) {
    return { openHour: 7, closeHour: 22 };
  }

  // normaliser både åbning og lukketiden ved at parse dem til hele timer, og håndtere forskellige formater som "7", "07", "7:00", "07:00"
  const openHour = normalizeHour(match[1]);
  const closeHour = normalizeHour(match[2]);

  // hvis nogen af tiderne ikke kunne parses korrekt, returner standard åbningstider
  if (openHour == null || closeHour == null) {
    return { openHour: 7, closeHour: 22 };
  }

  return { openHour, closeHour };
};

//////////////////////////////////////////////
          // GRAPH STATUS//
//////////////////////////////////////////////

const resolveGraphStatus = (waitTimeSeconds: number): GraphStatus => {
  // få global ventetid state
  const waitStatus = resolveWaitStatusLabel(waitTimeSeconds);

  // definer label
  if (waitStatus === "Lang ventetid") return "travl";
  if (waitStatus === "Moderat ventetid") return "moderat";
  return "rolig";
};

// definer farve
const getColor = (status?: GraphStatus) => {
  switch (status) {
    case "travl":
      return "var(--error-red)";
    case "moderat":
      return "yellow";
    case "rolig":
      return "var(--brand-green)";
    default:
      return "transparent";
  }
};

// ===========================================================
//                 GENERER TIMER OG HØJDER TIL GRAF
// ===========================================================
const createHourBars = (historyByHour: Record<string, number>, openingHours: string, currentWaitTimeSeconds?: number,) => {
  // få aktuel dato
  const today = new Date();
  // parse åbningstider for at få openHour og closeHour
  const { openHour, closeHour } = parseOpeningHourRange(openingHours);
  // sæt minutter, sekunder og millisekunder til 0 for at få et rent tidspunkt for hver time
  const currentHour = new Date(); currentHour.setMinutes(0, 0, 0);

  // hvis lukketiden er tidligere end åbningstiden, returner en tom array (håndterer ugyldige åbningstider)
  if (closeHour < openHour) {
    return [];
  }

  // returner en array af objekter for hver time i åbningstidsintervallet
  return Array.from({ length: closeHour - openHour + 1 }, (_, index) => {

    const hourDate = new Date(today);

    hourDate.setHours(openHour + index, 0, 0, 0);

    // skab key for at slå ventetid op i history baseret på timestamp for timen
    const hourKey = String(hourDate.getTime());

    // definer nuværende
    const isCurrentHour = hourDate.getTime() === currentHour.getTime();

    // få ventetid for timen, brug currentWaitTimeSeconds hvis det er den aktuelle time, ellers slå op i history, og default til 0 hvis ingen data
    const waitTimeSeconds = isCurrentHour ? currentWaitTimeSeconds ?? historyByHour[hourKey] ?? 0 : historyByHour[hourKey] ?? 0;

    // højden på søjlen beregnes som en procentdel af den maksimale ventetid, baseret på mockup data, og afrundes til nærmeste heltal for at få en pæn pixelværdi
    const height = Math.round((waitTimeSeconds / waitTimeMockup.max_seconds) * GRAPH_MAX_BAR_HEIGHT);

    // current status defineres kun for den aktuelle time, og bestemmes ud fra ventetiden for den time ved at bruge resolveGraphStatus funktionen, ellers er det undefined for ikke-aktuelle timer
    const currentStatus = waitTimeSeconds > 0 ? resolveGraphStatus(waitTimeSeconds) : undefined;

    return {
      height,
      isCurrentHour,
      status: isCurrentHour ? currentStatus : undefined,
      time: isCurrentHour ? "Nu" : formatHourLabel(hourDate),
    };
  });
};

// ===========================================================
//                      KOMPONENT
// ===========================================================
const BusinessGraph = ({ locationPk, openingHours = DEFAULT_OPENING_HOURS }: { locationPk: string; openingHours?: string }) => {
  const { waitTimeByLocationPk, waitTimeHistoryByLocationPk } = useWashHall();

  // loop og start ved nuværende time
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const bars = useMemo(() => {
    // hent historikken for tilsvarende locationPk
    const historyByHour = waitTimeHistoryByLocationPk[locationPk] ?? {};
    // hent aktuel ventetid for locationPk
    const currentWaitTimeSeconds = waitTimeByLocationPk[locationPk];

    // returner array af objekter med time, højde og status for hver time i åbningstidsintervallet
    return createHourBars(historyByHour, openingHours, currentWaitTimeSeconds);
    // baseret på locationPk, åbningstider, aktuel ventetid og historik for ventetider, så grafen opdateres dynamisk når disse ændrer sig
  }, [locationPk, openingHours, waitTimeByLocationPk, waitTimeHistoryByLocationPk]);

  // find index for den aktuelle time i bars arrayet, så vi kan scrolle til den ved indlæsning
  const currentBarIndex = useMemo(() => bars.findIndex((bar) => bar.isCurrentHour), [bars]);

  useEffect(() => {
    if (!emblaApi) return;

    // scroll til den aktuelle time ved indlæsning, hvis den findes, ellers scroll til sidste bar (håndterer tilfælde hvor ingen bar er markeret som nuværende time)
    emblaApi.scrollTo(currentBarIndex >= 0 ? currentBarIndex : Math.max(bars.length - 1, 0), true);
  }, [bars.length, currentBarIndex, emblaApi]);

  return (
    <div className="flex items-center border-b-2 border-(--gray-60) gap-4 w-full">
      {/* VENSTRE */}
      <button onClick={() => emblaApi?.scrollPrev()}>
        <ArrowLeft size={30} color={"var(--gray-60)"} />
      </button>

      {/* KARRUSEL */}
      <div className="overflow-hidden flex-1" ref={emblaRef}>
        <div className="flex items-end gap-5 px-10">
          {bars.map((bar, index) => {
            const isStatusBar = !!bar.status;
            const color = getColor(bar.status);
            const borderColor = color !== "transparent" ? `color-mix(in srgb, ${color} 70%, black)` : "var(--gray-60)";

            return (
              <div key={index} className="flex-[0_0_auto] min-h-30 flex flex-col items-center justify-end">
                {isStatusBar && (
                  <div className="flex gap-1 pb-1 items-center">
                    <span style={{ color }}>{bar.status}</span>
                    {bar.status === "travl" ? <Error /> : bar.status === "rolig" ? <Validated /> : null}
                  </div>
                )}

                <div
                  className="w-20 border-t-5 border-l-5 border-r-5"
                  style={{
                    height: `${bar.height}px`,
                    backgroundColor: isStatusBar ? color : "transparent",
                    borderColor: isStatusBar ? borderColor : "var(--gray-60)",
                  }}
                />
                <span className="text-sm py-2">{bar.time}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* HØJRE */}
      <button onClick={() => emblaApi?.scrollNext()}>
        <ArrowRight size={30} color={"var(--gray-60)"} />
      </button>
    </div>
  );
};

export default BusinessGraph;
