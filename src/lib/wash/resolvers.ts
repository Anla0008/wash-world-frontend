"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Location } from "@/types/locations";
import { WashRoute, SubscriptionStatus } from "@/types/washType";
import { washHallState } from "@/mockupData/washData";
import { useWashStore } from "@/stores/useWashStore";
import { useGeoLocation } from "@/hooks/useGeoLocation";
import { useWash } from "@/hooks/useWash";

// resolvers.ts bruges til at simulerer logikken i vores API,
// så vi kan teste forskellige scenarier
// og holde vores komponenter rene for logik
// her bruges funktioner, der håndterer mockup-data

// ===========================================================
//                    GET BRUGERS LOKATION (GEO)
// ===========================================================

// kilde: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // jordens radius i kilometer
  const R = 6371;

  // omkonverter grader til radianer
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  // haversine formel - beregn afstand baseret på forskel i breddegrad og længdegrad
  const haversineformel = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;

  // beregn endelig afstand i kilometer
  return R * 2 * Math.atan2(Math.sqrt(haversineformel), Math.sqrt(1 - haversineformel));
}

// ===========================================================
//       GET NÆRMESTE VASKEHAL PÅ LOKATION OG GEO (SIMULERET)
// ===========================================================
export const useNearestWash = () => {
  // få lokationer fra backend
  const { getLocations } = useAuth();

  // få brugerens geolokation, loading state, koordinater og permission-state - håndteres i hooks/useGeoLocation.ts
  const { coords, isLoading: geoLoading, locationPermissionState } = useGeoLocation();

  // true når bruger aktivt afviser geolocation prompten
  const geolocationPermissionDenied = locationPermissionState === "tillad lokation";

  // state til at gemme nærmeste vaskehal, afstand og loading state for hele processen
  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);

  // state til at gemme afstanden til nærmeste vaskehal i kilometer
  const [nearestDistanceKm, setNearestDistanceKm] = useState<number | null>(null);

  // state til loading
  const [isLoading, setIsLoading] = useState(true);

  // set brugerens lokation i global state, så den kan bruges i hele appen med ID
  const setUserLocationId = useWashStore((state) => state.setLocationID);

  // set brugerens lokationsnavn i global state, så den kan bruges i hele appen med navn
  const setUserLocationName = useWashStore((state) => state.setLocationName);

  useEffect(() => {
    // hvis geolokation stadig loader eller ikke er tilgængelig, så gør ikke noget
    if (geoLoading || !coords) return;

    // asynkron funktion til at hente lokationer og beregne nærmeste vaskehal
    const findNearestLocation = async () => {
      // Locations er defineret i mocks/handlers.ts, og getLocations er en funktion i useAuth, der henter disse lokationer
      const locations: Location[] = await getLocations();

      // valide lokationer er dem, der har både latitude og longitude defineret, så man kan beregne afstanden til dem
      const valid = locations.filter((loc) => loc.location_lat != null && loc.location_lng != null);

      // hvis der ikke er nogen valide lokationer, så stop loading og returner tidligt
      if (!valid.length) {
        setIsLoading(false);
        return;
      }

      ////////////////////////// find nærmeste vaskehal ///////////////////////////
      const nearest = valid.reduce<{ location: Location; distance: number } | null>((closest, loc) => {
        // beregn afstanden i kilometer mellem brugerens koordinater og lokationens koordinater
        // getDistanceKm er en helperfunktion defineret øverst i komponentet (haversine-formlen)
        const distance = getDistanceKm(coords.latitude, coords.longitude, loc.location_lat!, loc.location_lng!);

        // opdater nærmeste vaskehal, hvis denne lokation er tættere på end den tidligere nærmeste
        if (!closest || distance < closest.distance) {
          return {
            location: loc,
            distance,
          };
        }

        return closest;
      }, null);

      // hvis der ikke blev fundet en nærmeste vaskehal, så stop loading og returner tidligt
      if (!nearest) {
        setIsLoading(false);
        return;
      }

      // opdater state med nærmeste vaskehal og afstand
      setNearestLocation(nearest.location);

      // sæt afstanden til nærmeste vaskehal i kilometer i state
      setNearestDistanceKm(nearest.distance);

      // hvis nærmeste vaskehal har en location_pk, så sæt denne i global state, så den kan bruges i hele appen
      if (nearest.location.location_pk) {
        setUserLocationId(nearest.location.location_pk);

        // set lokationsnavn i global state, så det kan bruges i hele appen ved navn
        setUserLocationName(nearest.location.location_name);
      }

      // stop loading når alt er færdigt
      setIsLoading(false);
    };

    findNearestLocation();
    // returner en cleanup funktion, der nulstiller state hvis komponentet unmountes eller coords ændres, for at undgå at vise forkerte data
  }, [coords, geoLoading, getLocations]);

  return {
    nearestLocation,
    nearestDistanceKm,
    geolocationPermissionDenied,
    isLoading: isLoading || geoLoading,
  };
};


// ===========================================================
//             RESOLVE ABONNOMENT STATUS
// ===========================================================
export const useSubscriptionStatus = () => {
  const { hasSub } = useWash();

  const [userSub, setUserSub] = useState<SubscriptionStatus>({
    hasSub: false,
    subType: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadSubscriptionStatus = async () => {
      const subscription = await hasSub();

      if (isMounted) {
        setUserSub(subscription);
      }
    };

    void loadSubscriptionStatus();

    return () => {
      isMounted = false;
    };
  }, [hasSub]);

  return userSub;
};

// 1. definer ruten på abonnoment status
// ===========================================================
//           BESTEM RUTE EFTER SUBSCRIPTION
// ===========================================================
export const resolveRoute = (userHasSub: boolean): WashRoute => {
  return userHasSub ? "/drive-in" : "/buy-wash";
};

// 2. definer error in distance hvis > 500 m
// ===========================================================
//           DEFINER BRUG AF VASK  EFTER DISTANCE
// ===========================================================

export const distanceFromWashhall = (distanceKm: number, userHasSub: boolean): WashRoute => {
  // hvis distance er større end 500 m, så returner error route
  if (distanceKm > 0.5) {
    return "/error-in-distance";
  } else {
    // ellers returner rute baseret på abonnementstatus
    return resolveRoute(userHasSub);
  }
};

// 3. kombiner de to funktioner
// ===========================================================
//    Bestem rute baseret på både distance og abonnement
// ===========================================================

export const resolveWashRouteFromDistance = (distanceKm: number, userHasSub: boolean): WashRoute => {
  const distanceRoute = distanceFromWashhall(distanceKm, userHasSub);

  // hvis distanceRuten er det samme som error route, så returner error route uanset abonnementstatus
  if (distanceRoute === "/error-in-distance") {
    return "/error-in-distance";
  }

  // ellers returner resolveRoute() baseret på subscription
  return resolveRoute(userHasSub);
};

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
export function updateHallState(state: { occupied: boolean; updatedAt: number; entryCreatedAt: number | null; registeredAfterSeconds: number }) {
  const now = Date.now();

  // Simuler om vaskehallen er optaget eller ledig uden ventetidsberegning.
  const occupied = Math.random() > 0.35;

  return {
    occupied,
    updatedAt: now,
    entryCreatedAt: state.entryCreatedAt,
    registeredAfterSeconds: state.registeredAfterSeconds,
  };
}