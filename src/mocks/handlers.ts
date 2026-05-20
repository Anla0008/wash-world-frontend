import { http, HttpResponse } from "msw";
import { singleWashData } from "@/mockupData/singleWashData";
import { WashStepResponse } from "@/types/wash";
import { washHallWaitTime } from "@/mockupData/washHallWaitTime";
import { carInWashHall } from "@/mockupData/carInWashHall";
import { distance } from "@/mockupData/distance";

import {
  resolveRoute,
  resolveStep,
  resolveProgressIndex,
} from "@/lib/wash/resolvers";

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
      progressIndex: resolveProgressIndex(route),
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

  http.get("/api/washhall/available", () => {
  return HttpResponse.json();
  }),

  // ===========================================================
  //              GET INDKØRSEL I VASKEHAL
  // ===========================================================

  http.get("/api/washhall/entry", () => {
  return HttpResponse.json(carInWashHall.seconds);
  }),

];


