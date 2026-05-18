"use client";
import { WashRoute } from "@/types/wash";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { SingleWashType } from "@/types/singleWashType";
import { WashingHalls } from "@/types/wash";
import { useAuth } from "./useAuth";
import { WashHallWaitTimeResponse } from "@/types/washHallWaitTimeType";
import { resolveWaitTime } from "@/lib/wash/resolvers";

export function useWash() {

  // ===========================================================
  //                  GET LOCATION PÅ BRUGER
  // ===========================================================
  const { getLocations } = useAuth();

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
//               POST BRUGERS VALGT VASKEHALL
// ===========================================================

  const postAvailableWashHall = useCallback(
    async (washHallId: string) => {
      const response = await fetch("/api/wash/single", {
        method: "POST",
        body: JSON.stringify({ wash_hall_id: washHallId }),
      });

      if (!response.ok) {
        throw new Error("Failed to choose available wash hall");
      }
    },
    []
  );

// ===========================================================
//                  GET VENTETID FOR VASKEHAL
// ===========================================================
const useWashHallWaitTime = () => {
  const [waitTime, setWaitTime] = useState<number | null>(null);

  useEffect(() => {
    const getRequest = async () => {
      const response = await fetch("/api/washhall/waittime", {
        cache: "no-store",
        method: "GET",
      });

      const json =
        (await response.json()) as WashHallWaitTimeResponse;

      const randomWaitTime = resolveWaitTime(json);

      setWaitTime(randomWaitTime);
    };

    void getRequest();
  }, []);

  return { waitTime, setWaitTime };
};

// ===========================================================
//             GET ANTAL AF VASKEHALLER FRA BACKEND
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
      // void for at køre den asynkrone funktion uden at skulle håndtere løftet, da useEffect ikke kan være asynkron
      void fetchWashHalls();
    }, []);

    return { washHalls };
  };


  return {
    getUserLocation,
    getWashStepFromApi,
    postAvailableWashHall,
    navigateToWashRoute,
    useSingleWash,
    useWashHall,
    useWashHallWaitTime,
  };
}


