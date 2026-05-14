"use client";
import { WashRoute } from "@/types/wash";
import { useCallback } from "react";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { SingleWashType } from "@/types/singleWashType";
import { WashingHalls } from "@/types/wash";

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

  return {
    getWashStepFromApi,
    navigateToWashRoute,
  };
}

// ===========================================================
//                RANDOM VENTETID SIMULERING 
// ===========================================================
  
  export const getRandomWaitTime = (): number => {
    const min = 60; // 1 minut
    const max = 300; // 5 minut
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

// ===========================================================
//                GET ENKELTVASK  (SIMULERING)
// ===========================================================

export function useSingleWash() {
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
}

// ===========================================================
//                  GET LEDIG VASKEHAL
// ===========================================================

export function useWashHall() {
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
}

// ===========================================================
//    BEREGN PROGRESS WIDTH (til timer og progressbar)
// ===========================================================

export function useWashProgress(totalTime: number) {
  // simuleret nuværende tid
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (totalTime <= 0) {
      setCurrentTime(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        // reset når den rammer slutningen
        if (prev >= totalTime) {
          return 0;
        }

        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTime]);

  // progress i procent
  const progress =
    totalTime > 0 ? Math.min((currentTime / totalTime) * 100, 100) : 0;

  // formatter tid til mm:ss
  const remainingTime = Math.max(totalTime - currentTime, 0);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}.${String(
    seconds,
  ).padStart(2, "0")}`;
  return { progress, formattedTime, currentTime, remainingTime };
}