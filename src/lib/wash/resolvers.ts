// resolvers bruges til at simulerer logikken i vores API, så vi kan teste forskellige scenarier og holde vores komponenter rene for logik
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Location } from "@/types/locations";
import { WashRoute, WashStep } from "@/types/wash";
import { WashHallWaitTimeResponse } from "@/types/washHallWaitTimeType";

// ===========================================================
//       GET NÆRMESTE VASKEHAL PÅ LOKATION (GEO)
// ===========================================================

// Haversine-formel: beregner luftlinjsafstand i km mellem to koordinater
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useNearestWash = () => {
    const { getLocations } = useAuth();
    const [nearestLocation, setNearestLocation] = useState<Location | null>(null);
  const [nearestDistanceKm, setNearestDistanceKm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

      const locations: Location[] = await getLocations();

            // Filtrer locations med koordinater og find den nærmeste
            const nearest = locations
                .filter((loc) => loc.location_lat !== undefined && loc.location_lng !== undefined)
                .reduce<Location | null>((closest, loc) => {
                    const dist = getDistanceKm(latitude, longitude, loc.location_lat!, loc.location_lng!);
                    if (!closest) return loc;
                    const closestDist = getDistanceKm(latitude, longitude, closest.location_lat!, closest.location_lng!);
                    return dist < closestDist ? loc : closest;
                }, null);

            setNearestLocation(nearest);
            if (nearest?.location_lat !== undefined && nearest?.location_lng !== undefined) {
              const distance = getDistanceKm(
                latitude,
                longitude,
                nearest.location_lat,
                nearest.location_lng
              );
              setNearestDistanceKm(distance);
            }
              setIsLoading(false);
            }, () => {
              setIsLoading(false);
            });
    }, [getLocations]);

          return { nearestLocation, nearestDistanceKm, isLoading };
};

// ===========================================================
//  BESTEM RUTE EFTER SUBSCRIPTION (SIMULERET)
// ===========================================================
export const resolveRoute = (hasSub: boolean): WashRoute => {
  return hasSub ? "/activeWash" : "/buyWash";
};

  // ===========================================================
  //              BESTEM STEP EFTER RUTE (SIMULERET)
  // ===========================================================

export const resolveStep = (route: WashRoute): WashStep => {
  return route === "/activeWash"
    ? "activeWash"
    : "buyWash";
};

// ===========================================================
//    DEFINER BRUG AF VASK  EFTER DISTANCE
// ===========================================================
export const distanceFromWashhall = (distanceKm: number): WashRoute => {
  if (distanceKm > 0.5) {
    return "/errorInDistance";
  } else {
    return "/buyWash"; //TODO; få til at snakke sammen med abonnomentstatus eller ej funktionen resolveRoute
  }
};

export const resolveWashRouteFromDistance = (
  distanceKm: number,
  hasSub: boolean
): WashRoute => {
  const distanceRoute = distanceFromWashhall(distanceKm);
  if (distanceRoute === "/errorInDistance") {
    return "/errorInDistance";
  }

  return resolveRoute(hasSub);
};

  // ===========================================================
  //      DEFINER PROGRESSINDEX FOR HVER ROUTE (progressbar)
  // ===========================================================

export const resolveProgressIndex = (
  route: WashRoute
): number => {
  switch (route) {
    case "/buyWash":
      return 1;

    case "/activeWash":
      return 2;

    default:
      return 0;
  }
};

  // ===========================================================
  //    UDREGN WIDTH TIL NÆSTE STEP FOR PROGRESSBAR
  // ===========================================================

export const resolveProgressSteps = (numbers: string[], activeIndex: number, progress?: number) => { //numbers: string fordi det er det format vi får fra API'et
  // total antal steps, baseret på numre i arrayet
    const totalSteps = numbers.length;

    // Beregn den grundlæggende progress baseret på aktive steps
    const stepProgressWidth =
      totalSteps > 1 ? ((activeIndex - 1) / (totalSteps - 1)) * 100 : 0;

    // Beregn bredden af hvert segment mellem steps
      const segmentWidth = 100 / (totalSteps - 1);
      
    // Beregn startpunktet for det nuværende segment
      const currentSegmentStart = (activeIndex - 1) * segmentWidth;

    // Beregn den endelige progress ved at tilføje den procentvise progress inden for det nuværende segment
      const clampedProgress =
        progress !== undefined
          ? currentSegmentStart + (progress / 100) * segmentWidth
          : stepProgressWidth;

  return clampedProgress;
}

  // ===========================================================
  //                 SIMULER LEDIG VASKEHAL
  // ==========================================================

  export const generateAvailibleWashHalls = (): string => {

    const washHalls = ["1", "2", "3"]; // TODO: erstat med vaskehaller, brugeren er tættest på
    const randomIndex = Math.floor(Math.random() * washHalls.length); // Vælg tilfældigt index

    return washHalls[randomIndex]; 
  }

// ===========================================================
//            RESOLVE RANDOM WAIT TIME
// ===========================================================
export const resolveWaitTime = (
  waitTime: WashHallWaitTimeResponse
): number => {
  const { wait_time_seconds_min: min, wait_time_seconds_max: max } = waitTime;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};