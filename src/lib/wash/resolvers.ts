"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Location } from "@/types/locations";
import { WashRoute, WashStep } from "@/types/washType";
import { WashHallWaitTimeResponse } from "@/types/washType";
import { washHallState } from "@/mockupData/washData";
import { useWashStore } from "@/stores/useWashStore";

// resolvers.ts bruges til at simulerer logikken i vores API,
// så vi kan teste forskellige scenarier
// og holde vores komponenter rene for logik
// her bruges funktioner, der håndterer mockup-data

// ===========================================================
//       GET NÆRMESTE VASKEHAL PÅ LOKATION (GEO)
// ===========================================================

// kilde: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // latitude: nord-syd position
  // longitude: øst-vest position

  // Jordens radius i km
  const R = 6371;

  // Konverter latituder fra grader til radianer
  const dLat = ((lat2 - lat1) * Math.PI) / 180;

  // Konverter longituder fra grader til radianer
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  // Haversine-formel: beregner luftlinjsafstand i km mellem de to koordinater
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;

  // Returner afstand i km
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export const useNearestWash = () => {
  // getLocations på lokationer i vores database
  const { getLocations } = useAuth();

  // Location --> types/wash.ts
  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);

  const [nearestDistanceKm, setNearestDistanceKm] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const setUserLocationId = useWashStore((state) => state.setLocationID);

  const setUserLocationName = useWashStore((state) => state.setLocationName);

  // hvis der ikke er geolocation, så sæt loading til false
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }

    // Hent brugerens aktuelle position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // extract latitude og longitude fra position
        const { latitude, longitude } = position.coords;

        // Hent alle lokationer fra Location[] i vores database via getLocations funktionen i useAuth hooket
        const locations: Location[] = await getLocations();

        const nearest = locations

          // filtrer lokationer i databasen uden gyldige koordinater fra beregningen
          .filter((loc) => loc.location_lat !== undefined && loc.location_lng !== undefined)

          // reducer listen af lokationer til den nærmeste baseret på afstand til brugerens koordinater
          .reduce<Location | null>((closest, loc) => {
            const dist = getDistanceKm(latitude, longitude, loc.location_lat!, loc.location_lng!);

            // hvis der ikke er en nærmeste lokation endnu, så sæt den aktuelle lokation som nærmeste
            if (!closest) return loc;

            // sammenlign afstanden til den aktuelle lokation med afstanden til den nærmeste lokation, og returner den nærmeste
            const closestDist = getDistanceKm(latitude, longitude, closest.location_lat!, closest.location_lng!);

            // hvis den aktuelle lokation er tættere på end den nærmeste, så returner den aktuelle lokation, ellers returner den nærmeste
            return dist < closestDist ? loc : closest;
          }, null);

        setNearestLocation(nearest);

        // hvis der er en nærmeste lokation, så sæt den i stores/useWashStore.ts (zustand/localStorage)
        if (nearest?.location_pk) {
          setUserLocationId(nearest.location_pk); // sæt id (bruges i API-kald)
          setUserLocationName(nearest.location_name); // sæt navn (bruges i reciept)
        }
        // hvis den nærmeste lokation har gyldige koordinater...
        if (nearest?.location_lat !== undefined && nearest?.location_lng !== undefined) {
          // så beregn distancen i km mellem brugerens koordinater og den nærmeste lokation
          const distance = getDistanceKm(latitude, longitude, nearest.location_lat, nearest.location_lng);

          setNearestDistanceKm(distance);
        }

        setIsLoading(false);
      },

      () => {
        setIsLoading(false);
      },
    );
  }, [getLocations]);

  return { nearestLocation, nearestDistanceKm, isLoading };
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
