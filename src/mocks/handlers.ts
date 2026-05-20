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
http.get("/api/washhall/available", async ({ request }) => {

    const url = new URL(request.url);

    const location_pk = url.searchParams.get("location_pk");

    // Valider at location_pk er til stede
    if (!location_pk) {return HttpResponse.json(
        { error: "Missing location_pk" },
        { status: 400 }
      ); 
    }

    // Fetch washhalls fra backenden
     const response = await fetch(baseUrl + `/wash-hall/${location_pk}`);

    // Håndter fejl ved fetching
    if (!response.ok) {return HttpResponse.json(
        { error: "Failed to fetch washhalls" },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Initialiser wash hall state for alle vaskehaller ved lokationen
    const washHalls: { car_wash_hall_number: number }[] =
      data.wash_halls;

    initializeHallState(washHalls);

    const resolvedHalls = washHalls.map((hall) => {

      // Hent den aktuelle state for vaskehallen (state angivet i lib/wash/resolvers.ts)
      const currentState = washHallState.get(String(hall.car_wash_hall_number));

        if (!currentState) return null;

        // Opdater state baseret på hvor lang tid der er gået siden sidste opdatering
        const updatedState = updateHallState(currentState);

        // Gem den opdaterede state tilbage i washHallState
        washHallState.set(String(hall.car_wash_hall_number), updatedState);

        // spread både vaskehallens statiske data og den opdaterede state i det endelige objekt der returneres
        return {
          ...hall,
          ...updatedState,
        };
      });

    // Filtrer vaskehaller, der er markeret som optaget fra
    const availableHalls = resolvedHalls.filter((hall: any) => hall && !hall.occupied);

    // vælg hal, der har kortest ventetid blandt de ledige vaskehaller. Hvis alle er optaget: vælg den med kortest ventetid
    const selectedHall = availableHalls[0] ?? resolvedHalls.sort((a: any, b: any) => a.waitTime - b.waitTime)[0];

    return HttpResponse.json({hall: selectedHall,});}
),

  // ===========================================================
  //              GET INDKØRSEL I VASKEHAL
  // ===========================================================

  http.get("/api/washhall/entry", () => {
  return HttpResponse.json(carInWashHall.seconds);
  }),

];


