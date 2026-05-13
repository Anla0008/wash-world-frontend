import { http, HttpResponse } from "msw";

import { WashStepResponse } from "@/types/wash";

import {
  resolveRoute,
  resolveStep,
  resolveProgressIndex,
} from "@/lib/wash/resolvers";

// Definerer vores mock handlers
export const handlers = [
  http.get("/api/wash/step", ({ request }) => {
    const url = new URL(request.url); // Henter has_sub parameteren fra query string

    const hasSub = url.searchParams.get("has_sub") === "true"; // Konverterer string til boolean

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
];
