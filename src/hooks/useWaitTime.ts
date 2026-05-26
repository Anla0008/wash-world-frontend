import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { initWashHalls, washHallState } from "@/lib/wash/waitTimeResolver";
import { Location } from "@/types/locations";
import { WashingHalls, WashHallRuntimeState } from "@/types/washType";

type WaitStatus = "rolig" | "moderat" | "travl";

function resolveWait(state: WashHallRuntimeState): number {
  if (state.broken) return 999;

  return state.carsInQueue * 180 + (state.occupied ? 120 : 0);
}

function resolveStatus(wait: number, broken: boolean): WaitStatus {
  if (broken || wait > 600) return "travl";
  if (wait > 180) return "moderat";

  return "rolig";
}

export function useWaitTime(locationId?: string) {
  const [waitTime, setWaitTime] = useState<number | null>(null);
  const [status, setStatus] = useState<WaitStatus>("rolig");

  useEffect(() => {
    if (!locationId) return;

    const interval = setInterval(() => {
      const state = washHallState.get(String(locationId));

      if (!state) return;

      const wait = resolveWait(state);

      setWaitTime(wait);
      setStatus(resolveStatus(wait, state.broken));
    }, 1000);

    return () => clearInterval(interval);
  }, [locationId]);

  return { waitTime, status };
}

export function useNearestWash() {
  const { getLocations } = useAuth();
  const [nearest, setNearest] = useState<Location | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNearest = async () => {
      const locations = await getLocations();

      initWashHalls(locations);

      if (isMounted) {
        setNearest(locations[0] ?? null);
      }
    };

    void loadNearest();

    return () => {
      isMounted = false;
    };
  }, [getLocations]);

  return nearest;
}


export function useAvailableWashHall(locationId?: string) {
  const [hall, setHall] = useState<WashingHalls | null>(null);

  useEffect(() => {
    if (!locationId) return;

    const fetchHall = async () => {
      const res = await fetch(
        `/api/washhall/available?location_pk=${locationId}`
      );

      const data = (await res.json()) as { hall?: WashingHalls | null };
      setHall(data.hall ?? null);
    };

    void fetchHall();
  }, [locationId]);

  return hall;
}