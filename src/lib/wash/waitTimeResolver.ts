import { WashHallRuntimeState } from "@/types/washType";
import { WaitStatus } from "@/types/locations";

export const washHallState = new Map<string, WashHallRuntimeState>();

export function initWashHalls(locations: any[]) {
  locations.forEach((loc) => {
    const id = String(loc.location_pk);

    if (!washHallState.has(id)) {
      washHallState.set(id, {
        occupied: Math.random() < 0.7,
        broken: Math.random() < 0.05,
        carsInQueue: Math.floor(Math.random() * 4),
        waitTime: 0,
        updatedAt: Date.now(),
        entryCreatedAt: null,
        registeredAfterSeconds: 0,
      });
    }
  });
}

export function getWaitStatusFromState(state: any): WaitStatus {
  if (!state) return "Kort ventetid";

  if (state.broken) return "Lang ventetid";

  const wait = state.carsInQueue * 180;

  if (wait > 600) return "Lang ventetid";
  if (wait > 180) return "Moderat ventetid";

  return "Kort ventetid";
}