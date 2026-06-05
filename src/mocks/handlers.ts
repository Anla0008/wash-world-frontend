"use client";
import { http, HttpResponse } from "msw";
import { WashStepResponse } from "@/types/washType";
import { washHallState, carInWashHall, washData } from "@/mockupData/washData";
import { initializeHallState, updateHallState, resolveRoute } from "@/lib/wash/resolvers";

const baseUrl = "http://127.0.0.1";

export const handlers = [

  // ===========================================================
  //                  GET SINGLEVASK DATA
  // ===========================================================

http.get("/api/wash/single", () => {
  return HttpResponse.json(washData);
}),

// ===========================================================
//              POST SINGLEVASK TYPE
// ===========================================================

http.post("/api/wash/single", () => {
return HttpResponse.json();
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
    const washHalls: { car_wash_hall_number: number }[] = data.wash_halls;

    initializeHallState(washHalls);

    // map over alle vaskehaller
    const resolvedHalls = washHalls.map((hall) => {

      // Hent den aktuelle state for vaskehallen (state angivet i lib/wash/resolvers.ts)
      const currentState = washHallState.get(String(hall.car_wash_hall_number));

      // hvis der ikke er en state for denne vaskehal, så returner null (den vil blive filtreret fra i næste step)
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

    // Filtrer vaskehaller, der er markeret som optaget fra den opdaterede liste af vaskehaller eller som er null
    const availableHalls = resolvedHalls.filter((hall: any) => hall && !hall.occupied);

    // vælg første ledige hal. Hvis alle er optaget, vælg første hal i listen.
    const selectedHall = availableHalls[0] ?? resolvedHalls.find((hall: any) => hall != null);

    // hvis der er en valgt vaskehal, så start registrering af bil i vaskehal
    if (selectedHall) {

      // get den valgte hal og dens tilsvarende nummer/name
      const hallKey = String( selectedHall.car_wash_hall_number);

      // Hent den aktuelle state for den valgte vaskehal - (state angivet i mocks/resolvers.ts)
      const hallState = washHallState.get(hallKey);

      if (hallState) {
        // Start altid en ny registreringsperiode, så drive-in varer fast 25 sekunder hver gang.
        hallState.entryCreatedAt = Date.now();
        hallState.registeredAfterSeconds = carInWashHall.registered_after_seconds;

        // gem den opdaterede state tilbage i washHallState
        washHallState.set(hallKey, hallState);
      }
    }

    return HttpResponse.json({hall: selectedHall,});}
),

  // ===========================================================
  //              GET INDKØRSEL I VASKEHAL
  // ===========================================================

http.get("/api/washhall/entry", ({ request }) => {
  console.log("Handler hit:", request.url);
    const url = new URL(request.url);

    // Valider at hall_number er til stede
    const hallNumber = url.searchParams.get("hall_number");

    // Fallback hvis der ikke findes en vaskehal
    if (!hallNumber) {
      return HttpResponse.json(
        { error: "Missing hall_number" },
        { status: 400 }
      );
    }

    // Hent state for den konkrete hal, som klienten spørger på.
    const hallKey = String(hallNumber);
    const hallState = washHallState.get(hallKey);

    // Hvis der ikke findes en state for denne vaskehal, eller entryCreatedAt ikke er sat...
    if (!hallState || !hallState.entryCreatedAt) {
      return HttpResponse.json(
        {
          // ... returner ikke registreret bil
          registered: false,
          // simuler tiden det tager for bilen at blive registreret i vaskehallen (registered_after_seconds)
          seconds_remaining: carInWashHall.registered_after_seconds,
        }
      );
    }

    // opdater registrering
    const now = Date.now();

    // simuler registrering baseret på hvor lang tid der er gået siden entryCreatedAt...
    const registeredAfterSeconds = hallState.registeredAfterSeconds;

    // / 1000 for at konvertere til sekunder 
    const secondsPassed = (now - hallState.entryCreatedAt) / 1000;

   // og den tid det tager for bilen at blive registreret i vaskehallen (registered_after_seconds)
    const registered = secondsPassed >= registeredAfterSeconds;

    // math.ceil for at runde op til nærmeste hele sekund, og Math.max for at sikre at det ikke bliver negativt
    return HttpResponse.json({ registered, seconds_remaining: Math.max(0, Math.ceil(registeredAfterSeconds - secondsPassed))});
  }),
];


