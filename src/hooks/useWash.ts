"use client";
import { WashRoute } from "@/types/wash";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { SingleWashType } from "@/types/singleWashType";
import { WashingHalls } from "@/types/wash";
import { useAuth } from "./useAuth";
import { WashHallWaitTimeResponse } from "@/types/washHallWaitTimeType";
import { resolveWaitTime } from "@/lib/wash/resolvers";
import { WashType } from "@/types/singleWashType";
import { useWashStore } from "@/stores/useWashStore";
import { distanceFromWashhall } from "@/lib/wash/resolvers";
import { get } from "http";
import { number } from "framer-motion";

export function useWash() {
      const baseUrl = "http://127.0.0.1:80";

  // ===========================================================
  //            GET LOCATION PÅ BRUGER
  // ===========================================================
  const { getLocations } = useAuth();

  const getUserLocation = useCallback(async (): Promise<string> => {
    const locations = await getLocations();

    // Random valgt lokation fra API responsen (simulering)
    const userLocation = locations[Math.floor(Math.random() * locations.length)];

    useWashStore.getState().setUserLocation(userLocation);

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
//            NAVIGATION TIL KORREKT WASH ROUTE (SIMULERING)
// ===========================================================

  const navigateToWashRoute = useCallback(
    async (
      navigate: (path: string) => void,
      user: User
    ) => {

      const distance = distanceFromWashhall();

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
//               POST BRUGERS VASKEPROCES
// ===========================================================
const postAvailableWashHall = useCallback(
  async ({
    wash,
    startedAt,
    endedAt,
  }: {
    wash: WashType;
    startedAt: number | null;
    endedAt: number | null;
  }) => {

    console.log("POST DATA:", {
      wash,
      startedAt,
      endedAt,
    });

    const response = await fetch(
      baseUrl + "/car-wash-history",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          license_plate_fk: "ABC123",

          car_wash_location_fk: "location_1",

          car_wash_hall_fk: "hall_1",

          car_wash_price: wash.price,

          car_wash_type: wash.name,

          car_wash_started_at: startedAt,

          car_wash_ended_at: endedAt,
        }),
      }
    );

    console.log("STATUS:", response.status);

    if (!response.ok) {

      const errorData = await response.json();

      console.log("BACKEND ERROR:", errorData);

      throw new Error(
        errorData.error || "Failed to save wash"
      );
    }

    console.log(localStorage.getItem("token"));

    const data = await response.json();

    console.log("SUCCESS:", data);

    return data;
  },
  []
);

// ===========================================================
//                  GET VENTETID FOR VASKEHAL (SIMULERING)
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

// ===========================================================
//                GET INDKØRSEL I VASKEHAL (simuleret)
// ===========================================================
const useEntryToWashHall = () => {
  const [entryTime, setEntryTime] = useState<number | null>(null);

  useEffect(() => {
    const getRequest = async () => {
      const response = await fetch("/api/washhall/entry", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get entry to wash hall");
      }

      const data = await response.json();
      setEntryTime(data);
    };

    void getRequest();
  }, []);

  return { entryTime };
};

  return {
    getUserLocation,
    getWashStepFromApi,
    postAvailableWashHall,
    navigateToWashRoute,
    useSingleWash,
    useWashHall,
    useWashHallWaitTime,
    useEntryToWashHall,
  };
}


