"use client";
import { createContext, useContext, useMemo, useState, ReactNode, useEffect, useCallback } from "react";
import { resolveWaitStatusLabel, createDiversifiedWaitTimesByLocation, createDiversifiedWaitTimesByLocationWithOffset } from "@/lib/wash/waitTime";
import { useWashStore } from "@/stores/useWashStore";
import { WaitTimeHistoryByLocationPk, WashHallContextType } from "@/types/washType";

const WashHallContext = createContext<WashHallContextType | undefined>(undefined);

const WAIT_TIMES_STORAGE_KEY = "washhall.waitTimesByLocation";
const WAIT_TIMES_HISTORY_STORAGE_KEY = "washhall.waitTimeHistoryByLocation";

const WAIT_TIMES_UPDATED_AT_STORAGE_KEY = "washhall.waitTimesUpdatedAt";
// udskiftet til 1 time for at give mere realistiske ventetider og undgå for hyppige opdateringer under testning
const WAIT_TIME_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

// tjek at locationPk er valid (ikke null, undefined eller "undefined")
const isValidLocationPk = (value: string | null | undefined): value is string => {
  return Boolean(value && value !== "undefined");
};

const getHourBucketTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0);
  return date.getTime();
};

const recordWaitTimeHistory = (
  previousHistory: WaitTimeHistoryByLocationPk,
  waitTimes: Record<string, number>,
  timestamp: number,
): WaitTimeHistoryByLocationPk => {
  const nextHistory: WaitTimeHistoryByLocationPk = { ...previousHistory };
  const bucketTimestamp = String(getHourBucketTimestamp(timestamp));
  const oldestAllowedTimestamp = getHourBucketTimestamp(timestamp - (23 * 60 * 60 * 1000));

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

// Funktioner til at læse og skrive ventetider i localStorage
const readStoredWaitTimes = (): {
  waitTimes: Record<string, number>;
  waitTimeHistoryByLocationPk: WaitTimeHistoryByLocationPk;
  updatedAt: number | null;
} => {

  try {
    // læs ventetider fra localStorage
    const rawWaitTimes = localStorage.getItem(WAIT_TIMES_STORAGE_KEY);
    const rawWaitTimeHistory = localStorage.getItem(WAIT_TIMES_HISTORY_STORAGE_KEY);
    // læs opdateringstidspunkt fra localStorage
    const rawUpdatedAt = localStorage.getItem(WAIT_TIMES_UPDATED_AT_STORAGE_KEY);

    // parse ventetider og opdateringstidspunkt, håndter fejl ved parsing
    const waitTimes = rawWaitTimes ? (JSON.parse(rawWaitTimes) as Record<string, number>) : {};
    const waitTimeHistoryByLocationPk = rawWaitTimeHistory ? (JSON.parse(rawWaitTimeHistory) as WaitTimeHistoryByLocationPk) : {};
    // læs tidspunktet ventehallen er opdateret på
    const updatedAt = rawUpdatedAt ? Number(rawUpdatedAt) : null;

    // hvis updatedAt ikke er et gyldigt tal, returner tomme ventetider og null for updatedAt
    if (!Number.isFinite(updatedAt)) {
      return { waitTimes, waitTimeHistoryByLocationPk, updatedAt: null };
    }

    // returner de læste ventetider og opdateringstidspunkt
    return { waitTimes, waitTimeHistoryByLocationPk, updatedAt };
  } catch {
    // hvis der opstår en fejl (f.eks. ved parsing), returner tomme ventetider og null for updatedAt
    return { waitTimes: {}, waitTimeHistoryByLocationPk: {}, updatedAt: null };
  }
};

// Funktion til at skrive ventetider og opdateringstidspunkt til localStorage
const writeStoredWaitTimes = (
  waitTimes: Record<string, number>,
  waitTimeHistoryByLocationPk: WaitTimeHistoryByLocationPk,
  updatedAt: number,
) => {
  // hvis vi er i et miljø uden window (f.eks. server-side rendering), skal vi ikke forsøge at skrive til localStorage
  if (typeof window === "undefined") return;

  // set state for ventetider og opdateringstidspunkt i localStorage
  localStorage.setItem(WAIT_TIMES_STORAGE_KEY, JSON.stringify(waitTimes));
  localStorage.setItem(WAIT_TIMES_HISTORY_STORAGE_KEY, JSON.stringify(waitTimeHistoryByLocationPk));
  localStorage.setItem(WAIT_TIMES_UPDATED_AT_STORAGE_KEY, String(updatedAt));
};

////////////////////////////// PROVIDER KOMPONENT //////////////////////////////
export const WashHallProvider = ({ children }: { children: ReactNode }) => {

  // hent den aktive locationPk fra zustand store
  const activeLocationPk = useWashStore((state) => state.locationID);

  // initialiser state for ventetider og opdateringstidspunkt ved at læse fra localStorage og tjekke om data er ok
  const initialState = useMemo(() => {
    // læs ventetider og opdateringstidspunkt fra localStorage
    const { waitTimes, waitTimeHistoryByLocationPk, updatedAt } = readStoredWaitTimes();
    // er data ok - tjek at updatedAt ikke er null og at det ikke er for gammelt (ældre end WAIT_TIME_REFRESH_INTERVAL_MS)
    const isFresh = updatedAt != null && Date.now() - updatedAt < WAIT_TIME_REFRESH_INTERVAL_MS;


    if (isFresh) {
      const hydratedHistory = recordWaitTimeHistory(waitTimeHistoryByLocationPk, waitTimes, updatedAt);

      return {
        waitTimeByLocationPk: waitTimes,
        waitTimeHistoryByLocationPk: hydratedHistory,
        updatedAt,
      };
    }

    // object key for hver locationPk i waitTimes, og generer nye ventetider for dem 
    const locationPks = Object.keys(waitTimes);
    // generer nye ventetider for de locationPks vi har i localStorage, for at sikre at vi starter med realistiske ventetider, selvom data i localStorage er forældet
    const regeneratedWaitTimes = createDiversifiedWaitTimesByLocation(locationPks);
    const regeneratedHistory = recordWaitTimeHistory({}, regeneratedWaitTimes, Date.now());
    // opdater localStorage med de regenererede ventetider og det nye opdateringstidspunkt
    const regeneratedUpdatedAt = Date.now();
    // skriv de regenererede ventetider og det nye opdateringstidspunkt til localStorage
    writeStoredWaitTimes(regeneratedWaitTimes, regeneratedHistory, regeneratedUpdatedAt);

    return {
      waitTimeByLocationPk: regeneratedWaitTimes,
      waitTimeHistoryByLocationPk: regeneratedHistory,
      updatedAt: regeneratedUpdatedAt,
    };
  }, []);

  // state for ventetider og opdateringstidspunkt
  const [waitTimeByLocationPk, setWaitTimeByLocationPk] = useState<Record<string, number>>(initialState.waitTimeByLocationPk);
  const [waitTimeHistoryByLocationPk, setWaitTimeHistoryByLocationPk] = useState<WaitTimeHistoryByLocationPk>(initialState.waitTimeHistoryByLocationPk);

  // state for hvornår ventetiderne sidst blev opdateret, initialiseret til det opdateringstidspunkt vi har i localStorage (eller nu hvis data i localStorage var forældet)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(initialState.updatedAt ?? Date.now());

  // funktion til at opdatere ventetider for alle locationPks, genererer nye ventetider for alle locationPks vi har i state, og opdaterer localStorage og lastUpdatedAt
  const refreshWaitTimes = useCallback(() => {
    // set wait time 
    setWaitTimeByLocationPk((previous) => {

      const locationPks = Object.keys(previous);

      const refreshed = createDiversifiedWaitTimesByLocation(locationPks);

      const now = Date.now();
      const nextHistory = recordWaitTimeHistory(waitTimeHistoryByLocationPk, refreshed, now);

      setWaitTimeHistoryByLocationPk(nextHistory);

      // skriv de opdaterede ventetider og det nye opdateringstidspunkt til localStorage
      writeStoredWaitTimes(refreshed, nextHistory, now);

      // set last updated at til nu
      setLastUpdatedAt(now);

        // returner de opdaterede ventetider, som vil blive sat i state
      return refreshed;
    });
  }, [waitTimeHistoryByLocationPk]);

  // funktion til at sikre at vi har ventetider for en given liste af locationPks, tjekker hvilke locationPks vi mangler ventetider for, genererer ventetider for dem, og opdaterer state og localStorage
  const ensureWaitTimesForLocations = useCallback((locationPks: string[]) => {
    // hvis locationPks er tom, skal vi ikke gøre noget, så returner tidligt
    if (locationPks.length === 0) return;

    // set wait time for de locationPks vi mangler ventetider for
    setWaitTimeByLocationPk((previous) => {
      // filtrer locationPks for at finde dem vi mangler ventetider for (dem der ikke har en entry i previous)
      const missingLocationPks = locationPks.filter((locationPk) => previous[locationPk] == null);

      // hvis den mangler returner den sidste
      if (missingLocationPks.length === 0) {
        return previous;
      }

      // tilføjer ventetider for de locationPks vi mangler, ved at generere ventetider for dem og tilføje dem til previous, og returner det nye object som vil blive sat i state
      const additions = createDiversifiedWaitTimesByLocationWithOffset(missingLocationPks, Object.keys(previous).length);
      // spreading for at bevare eksisterende ventetider og tilføje de nye for de locationPks vi manglede
      const next = {
        ...previous,
        ...additions,
      };

      const now = Date.now();
      const nextHistory = recordWaitTimeHistory(waitTimeHistoryByLocationPk, additions, now);

      setWaitTimeHistoryByLocationPk(nextHistory);

      // skriv de opdaterede ventetider og det nye opdateringstidspunkt til localStorage
      writeStoredWaitTimes(next, nextHistory, now);
      setLastUpdatedAt(now);

      return next;
    });
  }, [waitTimeHistoryByLocationPk]);

  // få nu ventetiden ved at brige useCallback for at memoize funktionen, så den kun ændres hvis waitTimeByLocationPk ændres, og kast en fejl hvis vi ikke har en ventetid for den locationPk vi spørger efter
  const getWaitTimeForLocation = useCallback((locationPk: string) => {
    // tjek at vi har en ventetid for den locationPk vi spørger efter
    const existingWaitTime = waitTimeByLocationPk[locationPk];


    if (existingWaitTime == null) {
      throw new Error(`Mangler global ventetid for location_pk: ${locationPk}`);
    }

    return existingWaitTime;
  }, [waitTimeByLocationPk]);


  const getWaitStatusForLocation = useCallback((locationPk: string) => {

    // få label for tilsvarende ventetid
    return resolveWaitStatusLabel(getWaitTimeForLocation(locationPk));

  }, [getWaitTimeForLocation]);

  // useEffect til at sikre at vi har ventetider for den aktive locationPk, kører når activeLocationPk eller ensureWaitTimesForLocations ændres
  useEffect(() => {

    if (!isValidLocationPk(activeLocationPk)) return;
    
    // sikrer ventetiden for den aktuelle lokation
    ensureWaitTimesForLocations([activeLocationPk]);

  }, [activeLocationPk, ensureWaitTimesForLocations]);

  useEffect(() => {
    const interval = setInterval(() => {
      // returner tidspunktet for sidste opdatering og tjek om det er længere tid siden end vores definerede interval for opdatering af ventetider,
      if (Date.now() - lastUpdatedAt >= WAIT_TIME_REFRESH_INTERVAL_MS) {
         // og hvis det er, så opdater ventetiderne
        refreshWaitTimes();
      }
    }, 60_000); // tjek hver minut, om det er tid til at opdatere ventetiderne

    // ryd intervallet når komponenten unmountes eller når lastUpdatedAt eller refreshWaitTimes ændres, for at undgå memory leaks
    return () => clearInterval(interval);
  }, [lastUpdatedAt, refreshWaitTimes]);

  // useMemo til at beregne den aktive ventetid baseret på den aktive locationPk og waitTimeByLocationPk
  const activeWaitTime = useMemo(() => {
    // hvis activeLocationPk er valid, så prøv at få ventetiden for den locationPk
    if (isValidLocationPk(activeLocationPk)) {
      // få ventetiden for den aktive locationPk
      const resolved = waitTimeByLocationPk[activeLocationPk];

        return resolved;
    }

    // returner den f'rst kendte ventetid, hvis activeWaitTime ikke er valid
    const firstKnownWaitTime = Object.values(waitTimeByLocationPk)[0];

    // findes firstKnownWaitTime ikke, returner 0
    return firstKnownWaitTime ?? 0;
  }, [activeLocationPk, waitTimeByLocationPk]);

  // useMemo til at beregne waitStatus baseret på activeWaitTime, så den kun ændres når activeWaitTime ændres
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

// kilde: https://react.dev/reference/react/useContext#example-using-context-to-share-global-data
export const useWashHall = () => {
  // sikre at hook kun bruges inden for provider
  const ctx = useContext(WashHallContext);
  // hvis ctx er undefined, betyder det at hook bruges uden for provider, så kast en fejl
  if (!ctx) throw new Error("useWashHall must be used inside WashHallProvider");
  return ctx;
};