"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Location } from "@/types/locations";
import { WashRoute, WashStep } from "@/types/washType";
import { WashHallWaitTimeResponse } from "@/types/washType";
import { washHallState } from "@/mockupData/washData";
import { useWashStore } from "@/stores/useWashStore";
import { useGeoLocation } from "@/hooks/useGeoLocation";

// resolvers.ts bruges til at simulerer logikken i vores API,
// så vi kan teste forskellige scenarier
// og holde vores komponenter rene for logik
// her bruges funktioner, der håndterer mockup-data

// ===========================================================
//       GET NÆRMESTE VASKEHAL PÅ LOKATION (GEO)
// ===========================================================

// kilde: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
// distance helper
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number,): number {

  // jordens radius i kilometer
  const R = 6371;

  // omkonverter grader til radianer
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  // haversine formel - beregn afstand baseret på forskel i breddegrad og længdegrad
  const a =
      Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  // beregn endelig afstand i kilometer
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useNearestWash = () => {
  const { getLocations } = useAuth();
  const { coords, isLoading: geoLoading } = useGeoLocation();

  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);

  const [nearestDistanceKm, setNearestDistanceKm] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const setUserLocationId = useWashStore((state) => state.setLocationID,);

  const setUserLocationName = useWashStore((state) => state.setLocationName,);

  useEffect(() => {
    if (geoLoading || !coords) return;

    const run = async () => {
      
    const locations: Location[] = await getLocations();

      const valid = locations.filter(
        (loc) =>
          loc.location_lat != null &&
          loc.location_lng != null,
      );

      if (!valid.length) {
        setIsLoading(false);
        return;
      }

      const nearest = valid.reduce<{
        location: Location;
        distance: number;
      } | null>((closest, loc) => {
        const distance = getDistanceKm(
          coords.latitude,
          coords.longitude,
          loc.location_lat!,
          loc.location_lng!,
        );

        if (!closest || distance < closest.distance) {
          return {
            location: loc,
            distance,
          };
        }

        return closest;
      }, null);

      if (!nearest) {
        setIsLoading(false);
        return;
      }

      setNearestLocation(nearest.location);
      setNearestDistanceKm(nearest.distance);

      if (nearest.location.location_pk) {
        setUserLocationId(nearest.location.location_pk);
        setUserLocationName(
          nearest.location.location_name,
        );
      }

      setIsLoading(false);
    };

    run();
  }, [coords, geoLoading, getLocations]);

  return {
    nearestLocation,
    nearestDistanceKm,
    isLoading: isLoading || geoLoading,
  };
};

// ===========================================================
//  BESTEM RUTE EFTER SUBSCRIPTION (SIMULERET)
// ===========================================================
export const resolveRoute = (hasSub: boolean): WashRoute => {
  return hasSub ? "/active-wash" : "/buy-wash";
};

// ===========================================================
//              BESTEM STEP EFTER RUTE (SIMULERET)
// ===========================================================

export const resolveStep = (route: WashRoute): WashStep => {
  return route === "/active-wash" ? "active-wash" : "buy-wash";
};

// ===========================================================
//           DEFINER BRUG AF VASK  EFTER DISTANCE
// ===========================================================

export const distanceFromWashhall = (distanceKm: number): WashRoute => {
  // hvis distance er større end 500 m, så returner error route
  if (distanceKm > 0.5) {
    return "/error-in-distance";
  } else {
    return "/buy-wash"; //TODO; få til at snakke sammen med abonnomentstatus eller ej funktionen resolveRoute
  }
};

// ===========================================================
//    Bestem rute baseret på både distance og abonnement
// ===========================================================

export const resolveWashRouteFromDistance = (distanceKm: number, hasSub: boolean): WashRoute => {
  const distanceRoute = distanceFromWashhall(distanceKm);

  // hvis distanceRuten er det samme som error route, så returner error route uanset abonnementstatus
  if (distanceRoute === "/error-in-distance") {
    return "/error-in-distance";
  }

  // ellers returner ruten baseret på abonnementstatus
  return resolveRoute(hasSub);
};

// kilde: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
// ===========================================================
//       omkonveter varighed til minutter og sekunder
// ===========================================================

export const resolveDurationToMinutesSeconds = (durationInSeconds: number) => {
  // beregn antal hele minutter ved at dividere varigheden i sekunder med 60 og rund ned
  const minutes = Math.floor(durationInSeconds / 60);

  // beregn resterende sekunder ved at tage modulus af varigheden i sekunder med 60
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
    // Brug vaskehalens nummer som nøgle
    const key = String(hall.car_wash_hall_number);

    // Hvis der ikke allerede er en state for denne vaskehal, så opret en ny
    if (!washHallState.has(key)) {
      washHallState.set(key, {
        // simuler 30% chance for at vaskehallen er optaget ved initialisering
        occupied: Math.random() > 0.3,

        // simuler ventetid mellem 0 og 10 minutter
        waitTime: Math.floor(Math.random() * 600),

        // opdateringstidspunkt sættes til nu
        updatedAt: Date.now(),

        // sættes først når en specifik hal bliver valgt
        entryCreatedAt: null,
        registeredAfterSeconds: 0,
      });
    }
  });
}

// ===========================================================
//            OPDATER VASKEHALL STATE
// ==========================================================
export function updateHallState(state: { occupied: boolean; waitTime: number; updatedAt: number; entryCreatedAt: number | null; registeredAfterSeconds: number }) {
  const now = Date.now();

  // Beregn hvor lang tid der er gået siden sidste opdatering
  const secondsPassed = (now - state.updatedAt) / 1000;

  // Opdater ventetiden baseret på hvor lang tid der er gået
  const nextWaitTime = Math.max(0, state.waitTime - secondsPassed);

  // Simuler at vaskehallen bliver optaget eller ledig baseret på ventetiden og tilfældighed
  const occupied = nextWaitTime > 0 ? true : Math.random() > 0.8;

  return {
    occupied,
    waitTime: nextWaitTime,
    updatedAt: now,
    entryCreatedAt: state.entryCreatedAt,
    registeredAfterSeconds: state.registeredAfterSeconds,
  };
}

// ===========================================================
//   RESOLVE WAIT TIME (baseret på antal ledige vaskehaller)
// ===========================================================
export const resolveWaitTime = (waitTime: WashHallWaitTimeResponse): number => {
  const values = Object.values(waitTime).filter((value): value is number => Number.isFinite(value));

  if (values.length === 0) {
    return 0;
  }

  // Brug korteste ventetid blandt hallerne som den næste forventede indkørselstid.
  return Math.min(...values);
};
