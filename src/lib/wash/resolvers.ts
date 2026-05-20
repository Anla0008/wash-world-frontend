// resolvers bruges til at simulerer logikken i vores API, så vi kan teste forskellige scenarier og holde vores komponenter rene for logik
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Location } from "@/types/locations";
import { WashRoute, WashStep } from "@/types/wash";
import { WashHallWaitTimeResponse } from "@/types/washHallWaitTimeType";
import { washHallState } from "@/mockupData/washHallState";
import { useWashStore } from "@/stores/useWashStore";

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
  const setUserLocationId = useWashStore((state) => state.setLocationID);
  const setUserLocationName = useWashStore((state) => state.setLocationName);

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
            if (nearest?.location_pk) {
              setUserLocationId(nearest.location_pk);
              setUserLocationName(nearest.location_name);
            }
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

export const resolveDurationToMinutesSeconds = (
  durationInSeconds: number
) => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  return {
    minutes,
    seconds,
    formattedDuration: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
  };
};



  // ===========================================================
  //            INITIALISER VASKEHALL STATE
  // ==========================================================

export function initializeHallState(halls: { car_wash_hall_number: number }[]) {
  halls.forEach((hall) => {
    const key = String(hall.car_wash_hall_number);
    if (!washHallState.has(key)) {
      washHallState.set(key, {
        occupied: Math.random() > 0.3,
        waitTime: Math.floor(Math.random() * 600),
        updatedAt: Date.now(),
      });
    }
  });
}

// ===========================================================
//            OPDATER VASKEHALL STATE
// ==========================================================
export function updateHallState(state: {
  occupied: boolean;
  waitTime: number;
  updatedAt: number;
}) {
  const now = Date.now();

  const secondsPassed =
    (now - state.updatedAt) / 1000;

  const nextWaitTime = Math.max(
    0,
    state.waitTime - secondsPassed
  );

  const occupied =
    nextWaitTime > 0
      ? true
      : Math.random() > 0.8;

  return {
    occupied,
    waitTime: nextWaitTime,
    updatedAt: now,
  };
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