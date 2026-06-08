"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { resolveWaitStatusLabel } from "@/lib/wash/waitTime";
import { waitTimeMockup } from "@/mockupData/washData";
import { useWashStore } from "@/stores/useWashStore";
import { WaitTimeHistoryByLocationPk, WashHallContextType } from "@/types/washType";


// storage keys for wait times og historik,
// så vi kan cache og genskabe konsistente wait times pr.
// lokation og time-bucket, selv ved reloads.
const WashHallContext = createContext<WashHallContextType | undefined>(undefined);

const WAIT_TIMES_STORAGE_KEY = "washhall.waitTimesByLocation";

const WAIT_TIMES_HISTORY_STORAGE_KEY = "washhall.waitTimeHistoryByLocation";

const WAIT_TIMES_UPDATED_AT_STORAGE_KEY = "washhall.waitTimesUpdatedAt";

const HOUR_MS = 60 * 60 * 1000;

// Validering for locationPk, da det er essentielt for vores wait time logik, at den er gyldig og konsistent.
const isValidLocationPk = (value: string | null | undefined): value is string => {
  return Boolean(value && value !== "undefined");
};

// For at sikre konsistente wait times pr. lokation og time,
// genererer vi dem deterministisk baseret på locationPk og time-bucket.
const getHourBucketTimestamp = (timestamp: number): number => {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0);
  return date.getTime();
};

// Vi ønsker at wait times skal være konsistente for en given lokation og time
// så vi bruger en hash-funktion til at generere en pseudo-random wait time baseret på locationPk
// og time-bucket. Dette sikrer, at alle brugere ser den samme wait time for en lokation i løbet af en given time
const hashStringToPositiveInt = (value: string): number => {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

// Generer en deterministisk wait time for en lokation baseret på locationPk og time-bucket
const createDeterministicWaitTimeForLocationAtHour = (locationPk: string, hourBucketTimestamp: number): number => {
  const key = `${locationPk}:${hourBucketTimestamp}`;
  const hash = hashStringToPositiveInt(key);
  const { min_seconds, max_seconds } = waitTimeMockup;
  const range = max_seconds - min_seconds + 1;

  return min_seconds + (hash % range);
};

// Bygger et sæt wait times for en liste af locationPks baseret på deres respektive time-buckets
const buildWaitTimesForLocations = (locationPks: string[], timestamp: number): Record<string, number> => {
  const hourBucket = getHourBucketTimestamp(timestamp);

  return locationPks.reduce<Record<string, number>>((acc, locationPk) => {
    acc[locationPk] = createDeterministicWaitTimeForLocationAtHour(locationPk, hourBucket);
    return acc;
  }, {});
};

// Opdaterer historikken for wait times ved at tilføje nye wait times og trimme gamle entrys
const recordWaitTimeHistory = (previousHistory: WaitTimeHistoryByLocationPk, waitTimes: Record<string, number>, timestamp: number,): WaitTimeHistoryByLocationPk => {

  const nextHistory: WaitTimeHistoryByLocationPk = { ...previousHistory };

  const bucketTimestamp = String(getHourBucketTimestamp(timestamp));

  const oldestAllowedTimestamp = getHourBucketTimestamp(timestamp - 23 * HOUR_MS);

  // For hver locationPk i de nye wait times, tilføj et entry i historikken for denne time-bucket,
    // og trim historikken for denne lokation ved at fjerne entrys der er ældre end 24 timer.
  Object.entries(waitTimes).forEach(([locationPk, waitTime]) => {

    const existingHistory = previousHistory[locationPk] ?? {};

    const trimmedHistory = Object.fromEntries(

      Object.entries(existingHistory).filter(([hourTimestamp]) => Number(hourTimestamp) >= oldestAllowedTimestamp),
      
    );

    nextHistory[locationPk] = {
      ...trimmedHistory,
      [bucketTimestamp]: waitTime,
    };
  });

  return nextHistory;
};

// Funktioner til at læse og skrive wait times og historik til localStorage,
// så vi kan bevare konsistente wait times og historik på tværs af reloads.
const readStoredWaitTimes = (): {waitTimes: Record<string, number>; waitTimeHistoryByLocationPk: WaitTimeHistoryByLocationPk; updatedAt: number | null;} => {

  try {
    const rawWaitTimes = localStorage.getItem(WAIT_TIMES_STORAGE_KEY);

    const rawWaitTimeHistory = localStorage.getItem(WAIT_TIMES_HISTORY_STORAGE_KEY);

    const rawUpdatedAt = localStorage.getItem(WAIT_TIMES_UPDATED_AT_STORAGE_KEY);

    const waitTimes = rawWaitTimes ? (JSON.parse(rawWaitTimes) as Record<string, number>) : {};

    const waitTimeHistoryByLocationPk = rawWaitTimeHistory ? (JSON.parse(rawWaitTimeHistory) as WaitTimeHistoryByLocationPk) : {};

    const updatedAt = rawUpdatedAt ? Number(rawUpdatedAt) : null;

    return {waitTimes, waitTimeHistoryByLocationPk, updatedAt: Number.isFinite(updatedAt) ? updatedAt : null,};
  } catch {
    return { waitTimes: {}, waitTimeHistoryByLocationPk: {}, updatedAt: null };
  }
};

// Funktion til at skrive wait times og historik til localStorage,
// samt opdatere det sidste opdateringstidspunkt
const writeStoredWaitTimes = (waitTimes: Record<string, number>,waitTimeHistoryByLocationPk: WaitTimeHistoryByLocationPk,updatedAt: number,) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(WAIT_TIMES_STORAGE_KEY, JSON.stringify(waitTimes));

  localStorage.setItem(WAIT_TIMES_HISTORY_STORAGE_KEY, JSON.stringify(waitTimeHistoryByLocationPk));

  localStorage.setItem(WAIT_TIMES_UPDATED_AT_STORAGE_KEY, String(updatedAt));
};

// ===========================================================
//                 VASKEHALL KONTEKST
// ===========================================================

// Vi bruger en Map til at holde styr på state for hver vaskehal,
// da det giver os nem adgang og opdatering baseret på vaskehalens nummer (car_wash_hall_number).
// Hver vaskehal har en state der indeholder:
// - occupied: om vaskehallen er optaget eller ej (simuleret med random ved initialisering og opdatering)
// - updatedAt: tidspunkt for sidste opdatering af denne vaskehal (bruges til at simulere real-time opdateringer)
// - entryCreatedAt: tidspunkt for hvornår en bil blev registreret i vaskehallen (sættes når en bil registreres i hallen)
// - registeredAfterSeconds: hvor mange sekunder siden bilen blev registreret i hallen (sættes når en bil registreres i hallen, baseret på mock data)
export const WashHallProvider = ({ children }: { children: ReactNode }) => {
  const activeLocationPk = useWashStore((state) => state.locationID);

  //vi bruger denne state til at holde styr på den første ledige vaskehal,
  // som vi finder ved at kalde useAvailableWashHall i AvailibleWashingHall komponenten.
  // Når vi har fundet en ledig vaskehal, sætter vi den i denne state, så den kan bruges i hele vaskeflowet,
  // fx i ActiveWash komponenten, hvor vi viser den aktive vaskehal til brugeren.
  const initialState = useMemo(() => {
    const now = Date.now();
    const { waitTimes, waitTimeHistoryByLocationPk, updatedAt } = readStoredWaitTimes();

    // Genskab snapshot fra time-seedet, så output altid er konsistent pr. lokation og time.
    const hydratedWaitTimes = buildWaitTimesForLocations(Object.keys(waitTimes), now);

    const hydratedHistory = recordWaitTimeHistory(waitTimeHistoryByLocationPk, hydratedWaitTimes, now);
    
    const hydratedUpdatedAt = updatedAt ?? now;

    writeStoredWaitTimes(hydratedWaitTimes, hydratedHistory, hydratedUpdatedAt);

    return {
      waitTimeByLocationPk: hydratedWaitTimes,
      waitTimeHistoryByLocationPk: hydratedHistory,
      updatedAt: hydratedUpdatedAt,
    };
  }, []);

  const [waitTimeByLocationPk, setWaitTimeByLocationPk] = useState<Record<string, number>>(initialState.waitTimeByLocationPk);

  const [waitTimeHistoryByLocationPk, setWaitTimeHistoryByLocationPk] = useState<WaitTimeHistoryByLocationPk>( initialState.waitTimeHistoryByLocationPk,);

  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(initialState.updatedAt);

  // ===========================================================
  //       REGISTRER BIL I VASKEHAL OG OPDATER STATE
  // ===========================================================
  // Denne funktion kaldes i mocks/handlers.ts når vi får data om den ledige vaskehal.
    // Den opdaterer state for den valgte vaskehal ved at sætte entryCreatedAt og registeredAfterSeconds,
    // som bruges til at simulere hvor lang tid bilen har været i vaskehallen, og dermed hvor lang tid der er tilbage af vasken.
  const persistCurrentHourSnapshot = useCallback((locationPks: string[], timestamp: number) => {
    if (locationPks.length === 0) {

      setLastUpdatedAt(timestamp);

      writeStoredWaitTimes({}, waitTimeHistoryByLocationPk, timestamp);

      return;
    }

    const currentHourSnapshot = buildWaitTimesForLocations(locationPks, timestamp);

    setWaitTimeByLocationPk(currentHourSnapshot);

    // Opdater historikken med det nye snapshot, så vi bevarer en log over tidligere wait times for hver lokation.
    setWaitTimeHistoryByLocationPk((previousHistory) => {

      const nextHistory = recordWaitTimeHistory(previousHistory, currentHourSnapshot, timestamp);

      writeStoredWaitTimes(currentHourSnapshot, nextHistory, timestamp);

      return nextHistory;
    });

    setLastUpdatedAt(timestamp);
  }, [waitTimeHistoryByLocationPk]);

  // Denne funktion sikrer, at vi har genereret wait times for de givne locationPks, hvis vi ikke allerede har det.
  const ensureWaitTimesForLocations = useCallback((locationPks: string[]) => {
    if (locationPks.length === 0) return;

    const now = Date.now();

    const hourBucket = getHourBucketTimestamp(now);

    // Byg et snapshot for de locationPks, der mangler wait times, baseret på deres respektive time-buckets.
    setWaitTimeByLocationPk((previous) => {
      const next = { ...previous };
      let hasChanges = false;

      // For hver locationPk, generer en deterministisk wait time for den aktuelle time-bucket, og opdater state hvis den mangler eller er forældet.
      locationPks.forEach((locationPk) => {

        const deterministicWaitTime = createDeterministicWaitTimeForLocationAtHour(locationPk, hourBucket);

        if (next[locationPk] !== deterministicWaitTime) {

          next[locationPk] = deterministicWaitTime;

          hasChanges = true;
        }
      });

      // har vi lavet ændringer i wait times for nogen af de givne locationPks
      //  Hvis ja, så brug det nye snapshot, ellers behold det eksisterende for at undgå unødvendige re-renders.
      const resolved = hasChanges ? next : previous;

      // Opdater historikken med eventuelle nye wait times, så vi bevarer en log over
      // tidligere wait times for hver lokation.
      setWaitTimeHistoryByLocationPk((previousHistory) => {

        const additions = locationPks.reduce<Record<string, number>>((acc, locationPk) => {
          acc[locationPk] = resolved[locationPk];

          return acc;
        }, {});

        // beregn det næste historik entry ved at tilføje de nye wait times for de givne
        // locationPks til den eksisterende historik, og trimme gamle entrys.
        const nextHistory = recordWaitTimeHistory(previousHistory, additions, now);
        writeStoredWaitTimes(resolved, nextHistory, now);
        return nextHistory;
      });

      setLastUpdatedAt(now);

      return resolved;
    });
  }, []);

// Funktion til at hente wait time for en given locationPk, baseret på den aktuelle time-bucket.
  const getWaitTimeForLocation = useCallback((locationPk: string) => {

    const hourBucket = getHourBucketTimestamp(Date.now());

    return createDeterministicWaitTimeForLocationAtHour(locationPk, hourBucket);

  }, []);

  // Funktion til at hente wait status label for en given locationPk, baseret på dens wait time.
  const getWaitStatusForLocation = useCallback((locationPk: string) => {

    return resolveWaitStatusLabel(getWaitTimeForLocation(locationPk));

  }, [getWaitTimeForLocation]);

  // Funktion til at opdatere wait times for alle kendte locationPks, baseret på deres respektive time-buckets.
  const refreshWaitTimes = useCallback(() => {

    const now = Date.now();

    const locationPks = Object.keys(waitTimeByLocationPk);

    // Hvis der ikke er nogen kendte locationPks, så opdater blot det sidste opdateringstidspunkt
    // og skriv tomme wait times og historik til storage.
    if (locationPks.length === 0) {

      setLastUpdatedAt(now);

      writeStoredWaitTimes({}, waitTimeHistoryByLocationPk, now);

      return;
    }

    // Byg et snapshot for alle kendte locationPks baseret på deres respektive time-buckets.
    const currentSnapshot = buildWaitTimesForLocations(locationPks, now);

    setWaitTimeByLocationPk(currentSnapshot);

    // Opdater historikken med det nye snapshot, så vi bevarer en log over tidligere wait times for hver lokation.
    setWaitTimeHistoryByLocationPk((previousHistory) => {

      const nextHistory = recordWaitTimeHistory(previousHistory, currentSnapshot, now);

      writeStoredWaitTimes(currentSnapshot, nextHistory, now);

      return nextHistory;
    });

    setLastUpdatedAt(now);
  }, [waitTimeByLocationPk, waitTimeHistoryByLocationPk]);

  // Når activeLocationPk ændres, sikrer vi, at vi har genereret wait times
  // for denne lokation, så vi altid har en wait time klar for den aktive lokation.
  useEffect(() => {
    if (!isValidLocationPk(activeLocationPk)) return;

    ensureWaitTimesForLocations([activeLocationPk]);

  }, [activeLocationPk, ensureWaitTimesForLocations]);

  // For at sikre, at wait times opdateres i real-time baseret på time-buckets
  //  sætter vi et interval til at tjekke for nye time-buckets og opdatere wait times derefter.
  useEffect(() => {
    const interval = setInterval(() => {

      const now = Date.now();

      const currentHourBucket = getHourBucketTimestamp(now);

      const previousHourBucket = getHourBucketTimestamp(lastUpdatedAt);

      // Ny time = ny seed. Genberegn deterministisk snapshot for kendte lokationer.
      if (currentHourBucket !== previousHourBucket) {
        persistCurrentHourSnapshot(Object.keys(waitTimeByLocationPk), now);
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [lastUpdatedAt, persistCurrentHourSnapshot, waitTimeByLocationPk]);

  // Den aktive wait time baseret på den aktive lokation
  //  Hvis der ikke er en aktiv lokation, eller hvis den aktive
  // lokation ikke har en wait time, så fallback til den første kendte wait
  // time for at sikre, at vi altid har en wait time at vise.
  const activeWaitTime = useMemo(() => {
    if (isValidLocationPk(activeLocationPk)) {
      return getWaitTimeForLocation(activeLocationPk);
    }

    const firstKnownLocationPk = Object.keys(waitTimeByLocationPk)[0];

    // Hvis der er en kendt locationPk,
    // så returner wait time for denne lokation
    //  ellers returner 0 som default.
    if (firstKnownLocationPk) {
      return getWaitTimeForLocation(firstKnownLocationPk);
    }

    return 0;

  }, [activeLocationPk, getWaitTimeForLocation, waitTimeByLocationPk]);

  const waitStatus = useMemo(() => resolveWaitStatusLabel(activeWaitTime), [activeWaitTime]);

  return (
    <WashHallContext.Provider
      value={{
        waitTimeByLocationPk,
        waitTimeHistoryByLocationPk,
        waitTime: activeWaitTime,
        waitStatus,
        ensureWaitTimesForLocations,
        getWaitTimeForLocation,
        getWaitStatusForLocation,
        refreshWaitTimes,
      }}
    >
      {children}
    </WashHallContext.Provider>
  );
};

export const useWashHall = (): WashHallContextType => {
  const ctx = useContext(WashHallContext);
  if (!ctx) throw new Error("useWashHall skal bruges inden i en WashHallProvider");
  return ctx;
};
