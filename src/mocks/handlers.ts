import { http, HttpResponse } from "msw";
import { WashStepResponse } from "@/types/washType";
import { washHallWaitTime, washHallState, carInWashHall, singleWashData } from "@/mockupData/washData";
import { initializeHallState, updateHallState, resolveRoute, resolveStep } from "@/lib/wash/resolvers";


const baseUrl = "http://127.0.0.1";
let currentAvailableHallNumber: number | null = null;

export const handlers = [
  // ===========================================================
  //                    GET WASH STEP
  // ===========================================================

  http.get("/api/wash/step", ({ request }) => {
    const url = new URL(request.url);

    // Henter has_sub parameteren fra query string og konverterer den til boolean
    const hasSub = url.searchParams.get("has_sub") === "true";

    // Bestemmer ruten baseret på abonnementsstatus
    const route = resolveRoute(hasSub);

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
    const availableHalls = resolvedHalls.filter((hall: any) => hall && !hall.occupied || null);

    // vælg hal, der har kortest ventetid blandt de ledige vaskehaller. Hvis alle er optaget: vælg den med kortest ventetid
    const selectedHall = availableHalls[0] ?? resolvedHalls.sort((a: any, b: any) => a.waitTime - b.waitTime)[0];

    // hvis der er en valgt vaskehal, så start registrering af bil i vaskehal
    if (selectedHall) { currentAvailableHallNumber = selectedHall.car_wash_hall_number;

      // get den valgte hal og dens tilsvarende nummer/name
      const hallKey = String( selectedHall.car_wash_hall_number);

      // Hent den aktuelle state for den valgte vaskehal - (state angivet i mocks/resolvers.ts)
      const hallState = washHallState.get(hallKey);

      // hvis der ikke allerede er oprettet en entryCreatedAt for denne vaskehal...
      if (hallState && !hallState.entryCreatedAt) {

        // så opret den nu for at starte registrering af bil i vaskehal
       hallState.entryCreatedAt = Date.now();

       // og sæt registeredAfterSeconds baseret på det simulerede tidspunkt for registrering i vaskehal
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

    // Valider at hall_number matcher den aktuelle ledige vaskehal
    if (Number(hallNumber) !== currentAvailableHallNumber) {
      return HttpResponse.json(
        { error: "hall_number is not the selected available hall" },
        { status: 409 }
      );
    }

    // Hent den aktuelle state for vaskehallen (state angivet i mocks/wash/resolvers.ts)
    const hallState = washHallState.get(String(currentAvailableHallNumber));

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


  // ===========================================================
  //              GET VENTETID FOR VASKEHAL
  // ===========================================================
  http.get("/api/washhall/waittime", () => {
    return HttpResponse.json(washHallWaitTime);
  }),
];


