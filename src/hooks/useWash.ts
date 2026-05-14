"use client";
import { WashRoute } from "@/types/wash";
import { useCallback } from "react";
import { User } from "@/types/user";


export function useWash() {

// ===========================================================
//        BESTEM ROUTE EFTER SUBSCRIPTION (SIMULERET)
// ===========================================================
  const getWashStepFromApi = useCallback(
    async (user: User): Promise<WashRoute> => {

      const response = await fetch(
        `/api/wash/step?has_sub=${user.has_sub}`,
        {
          method: "GET",
          headers: {
            "Cache-Control": "no-store",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get wash step");
      }

      const data = await response.json();

      return data.route;
    },
    []
  );

// ===========================================================
//            NAVIGATION TIL KORREKT WASH ROUTE
// ===========================================================

  const navigateToWashRoute = useCallback(
    async (
      navigate: (path: string) => void,
      user: User
    ) => {

      const route = await getWashStepFromApi(user);

      navigate(route);

      return route;
    },
    [getWashStepFromApi]
  );

// ===========================================================
//                RANDOM VENTETID SIMULERING 
// ===========================================================
  
  const getRandomWaitTime = (): number => {
    const min = 60; // 1 minut
    const max = 300; // 5 minut
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return {
    getWashStepFromApi,
    navigateToWashRoute,
    getRandomWaitTime,
  };
}

