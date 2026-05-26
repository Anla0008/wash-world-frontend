"use client";
import { http, HttpResponse } from "msw";
import { carInWashHall, washData } from "@/mockupData/washData";

const baseUrl = "http://127.0.0.1";
let currentAvailableHallNumber: number | null = null;

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

    return data;
  }),

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
  }),
];


