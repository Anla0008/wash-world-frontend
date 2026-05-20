import { http, HttpResponse } from "msw";
import { singleWashData } from "@/mockupData/singleWashData";
import { WashStepResponse } from "@/types/wash";
import { washHallWaitTime } from "@/mockupData/washHallWaitTime";
import { carInWashHall } from "@/mockupData/carInWashHall";
import { initializeHallState } from "@/lib/wash/resolvers";
import { updateHallState } from "@/lib/wash/resolvers";
import { washHallState } from "@/mockupData/washHallState";
import { useAuth } from "@/hooks/useAuth";

import {
  resolveRoute,
  resolveStep,
} from "@/lib/wash/resolvers";
import { get } from "http";
const baseUrl = "http://127.0.0.1";

export const handlers = [
  // ===========================================================
  //                    GET WASH STEP
  // ===========================================================

  http.get("/api/wash/step", ({ request }) => {
    const url = new URL(request.url);

    const hasSub = url.searchParams.get("has_sub") === "true"; // Henter has_sub parameteren fra query string og konverterer den til boolean

    const route = resolveRoute(hasSub); // Bestemmer ruten baseret på abonnementsstatus

    const response: WashStepResponse = {
      // Konstruerer response objektet
      step: resolveStep(route),
      route,
      has_sub: hasSub,
    };

    // Returnerer response som JSON
    return HttpResponse.json(response);
  }),

  // ===========================================================
  //                  GET SINGLEVASK DATA
  // ===========================================================

http.get("/api/wash/single", () => {
  return HttpResponse.json(singleWashData);
}),

// ===========================================================
//              POST SINGLEVASK TYPE
// ===========================================================

http.post("/api/wash/single", () => {
return HttpResponse.json();
}),

  // ===========================================================
  //              GET WASH HALL WAIT TIME
  // ===========================================================

  http.get("/api/washhall/waittime", () => {
  return HttpResponse.json(washHallWaitTime);
  }),

  // ===========================================================
  //              GET LEDIG VASKEHAL
  // ===========================================================
http.get(
  "/api/washhall/available",
  async ({ request }) => {
    const url = new URL(request.url);

    const location_pk =
      url.searchParams.get("location_pk");

    if (!location_pk) {
      return HttpResponse.json(
        { error: "Missing location_pk" },
        { status: 400 }
      );
    }

    // Fetch washhalls fra backenden
     const response = await fetch(baseUrl + `/wash-hall/${location_pk}`);

    if (!response.ok) {
      return HttpResponse.json(
        { error: "Failed to fetch washhalls" },
        { status: 500 }
      );
    }

    const data = await response.json();

    const washHalls: { car_wash_hall_number: number }[] =
      data.wash_halls;

    initializeHallState(washHalls);

    const resolvedHalls =
      washHalls.map((hall) => {
        const currentState =
          washHallState.get(
            String(hall.car_wash_hall_number)
          );

        if (!currentState) return null;

        const updatedState =
          updateHallState(currentState);

        washHallState.set(
          String(hall.car_wash_hall_number),
          updatedState
        );

        return {
          ...hall,
          ...updatedState,
        };
      });

    const availableHalls =
      resolvedHalls.filter(
        (hall: any) =>
          hall && !hall.occupied
      );

    const selectedHall =
      availableHalls[0] ??
      resolvedHalls.sort(
        (a: any, b: any) =>
          a.waitTime - b.waitTime
      )[0];

    return HttpResponse.json({
      hall: selectedHall,
    });
  }
),

  // ===========================================================
  //              GET INDKØRSEL I VASKEHAL
  // ===========================================================

  http.get("/api/washhall/entry", () => {
  return HttpResponse.json(carInWashHall.seconds);
  }),

];


