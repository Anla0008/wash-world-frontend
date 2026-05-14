"use client";
import { WashRoute } from "@/types/wash";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { SingleWashType } from "@/types/singleWashType";
import { WashingHalls } from "@/types/wash";
import { useAuth } from "./useAuth";

export function useWash() {
  const { getLocations } = useAuth();

// ===========================================================
//                  GET LOCATION PÅ BRUGER
// ===========================================================

  const getUserLocation = useCallback(async (): Promise<string> => {
    const locations = await getLocations();

    // Random valgt lokation fra API responsen (simulering)
    const userLocation = locations[Math.floor(Math.random() * locations.length)];

    return userLocation;
  }, [getLocations]);

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

  const getRandomWaitTime = useCallback((): number => {
    const min = 60; // 1 minut
    const max = 300; // 5 minut
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

// ===========================================================
//                GET ENKELTVASK  (SIMULERING)
// ===========================================================

  const useSingleWash = () => {
    const [data, setData] = useState<SingleWashType | null>(null);

    useEffect(() => {
      const getRequest = async () => {
        const response = await fetch("/api/wash/single", {
          cache: "no-store",
          method: "GET",
        });

        const json = (await response.json()) as SingleWashType;
        setData(json);
      };

      void getRequest();
    }, []);

    return { data };
  };

// ===========================================================
//                  GET LEDIG VASKEHAL
// ===========================================================

  const useWashHall = () => {
    const [washHalls, setWashHalls] = useState<WashingHalls[]>([]);
    const baseUrl = "http://127.0.0.1:80";

    useEffect(() => {
      const fetchWashHalls = async () => {
        const response = await fetch(baseUrl + "/washhall", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to get WashHalls");
        }

        const data = await response.json();

        setWashHalls(data.car_wash_hall_info);
      };

      void fetchWashHalls();
    }, []);

    return { washHalls };
  };

// ===========================================================
//    BEREGN PROGRESS WIDTH (til timer og progressbar)
// ===========================================================

  const useWashProgress = (totalTime: number) => {
    // simuleret nuværende tid
    const [currentTime, setCurrentTime] = useState(0);
    // useEffect for at mounte et interval, der opdaterer currentTime , og rydder det op ved unmount
    useEffect(() => {
      if (totalTime <= 0) {
        setCurrentTime(0);
        return;
      }

      const interval = setInterval(() => { // setInterval for at opdatere currentTime hvert sekund indtil den når totalTime
        setCurrentTime((prev) => {
          // reset når den rammer slutningen
          if (prev >= totalTime) {
            return 0;
          }

          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [totalTime]); // nulstil

    // progress i procent
    const progress =
      totalTime > 0 ? Math.min((currentTime / totalTime) * 100, 100) : 0;

    // formatter tid til mm:ss
    const remainingTime = Math.max(totalTime - currentTime, 0); // beregn resterende tid
    const minutes = Math.floor(remainingTime / 60); // /60 for at få hele minutter fra den resterende tid
    const seconds = remainingTime % 60; // % 60 for at få resterende sekunder efter at have trukket hele minutter fra

    const formattedTime = `${String(minutes).padStart(2, "0")}.${String(
      seconds,
    ).padStart(2, "0")}`; // padStart sikrer, der altid er to cifre for både minutter og sekunder, og adskiller dem med et punktum
    return { progress, formattedTime, currentTime, remainingTime };
  };

  return {
    getUserLocation,
    getWashStepFromApi,
    navigateToWashRoute,
    getRandomWaitTime,
    useSingleWash,
    useWashHall,
    useWashProgress,
  };
}


