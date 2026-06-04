"use client";
import { WashRoute, SingleWashType, WashingHalls, WashHallWaitTimeResponse, SubscriptionResponse } from "@/types/washType";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { resolveWaitTime } from "@/lib/wash/resolvers";
import { postWash } from "@/types/washType";
import { useQuery } from "@tanstack/react-query";

const baseUrl = "http://127.0.0.1:80";

export function useWash() {
  // ===========================================================
  //                    KØB ABONNOMENT
  // ===========================================================
  const postSubscriptionStatus = useCallback(async (user: User, wash: { name: string }): Promise<WashRoute> => {
    const response = await fetch(baseUrl + "/subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        has_sub: user.has_sub,
        sub_type: wash.name,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to determine subscription status");
    }

    const data = await response.json();

    return data;
  }, []);

  // ===========================================================
  //              GET BRUGERS ABONNOMENT STATUS
  // ===========================================================
  const hasSub = useCallback(async (): Promise<{ hasSub: boolean; subType: string | null }> => {
    const response = await fetch(baseUrl + "/subscription", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      return { hasSub: false, subType: null };
    }

    const data: SubscriptionResponse = await response.json();

    return {
      hasSub: data.has_sub,
      subType: data.sub_type,
    };
  }, []);

  // ===========================================================
  //                   UPDATE ABONNOMENT
  // ===========================================================
  const updateSubscription = useCallback(async (hasSub: boolean, subType: string | null) => {
    const response = await fetch(baseUrl + "/subscription", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        has_sub: hasSub,
        sub_type: subType,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update subscription status");
    }

    const data = await response.json();

    return data;
  }, []);

  // ===========================================================
  //                   DELETE ABONNOMENT
  // ===========================================================
  const deleteSubscription = useCallback(async () => {
    const response = await fetch(baseUrl + "/subscription", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete subscription");
    }

    const data = await response.json();

    return data;
  }, []);

  // ===========================================================
  //                GET ENKELTVASK  (MOCKUPDATA)
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
  //      NAVIGER TIL RUTE BASERET PÅ STATUS (SIMULERING)
  // ===========================================================
  const navigateBasedOnStatus = useCallback(async (): Promise<WashRoute> => {
    const userHasSub = await hasSub();

    return userHasSub.hasSub ? "/drive-in" : "/buy-wash";
  }, [hasSub]);

  // ===========================================================
  //                  GET VENTETID FOR VASKEHAL (SIMULERING)
  // ===========================================================
  const useWashHallWaitTime = () => {
    const [waitTime, setWaitTime] = useState<number | null>(null);

    useEffect(() => {
      const fetchWaitTime = async () => {
        try {
          const response = await fetch("/api/washhall/waittime", {
            method: "GET",
            headers: {
              "Cache-Control": "no-store",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch wash hall wait time");
          }

          const data = (await response.json()) as WashHallWaitTimeResponse;

          // Beregn samlet ventetid ved at summere ventetider for alle vaskehaller
          const totalWaitTime = resolveWaitTime(data);

          setWaitTime(totalWaitTime);
        } catch (err) {
          console.error(err instanceof Error ? err.message : "Unknown error");
        }
      };

      void fetchWaitTime();
    }, []);

    return waitTime;
  };

  // ===========================================================
  //             GET NÆSTE LEDIGE VASKEHAL (SIMULERING)
  // ===========================================================
  const useAvailableWashHall = (location_pk?: string) => {
    const [hall, setHall] = useState<WashingHalls | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!location_pk) return;

      const fetchHall = async () => {
        try {
          setIsLoading(true);

          const response = await fetch(`/api/washhall/available?location_pk=${location_pk}`, {
            method: "GET",
            headers: {
              "Cache-Control": "no-store",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch available washhall");
          }

          const data = await response.json();

          // status på ledig vaskehal, er defineret i mocks/handlers.ts
          setHall(data.hall);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
          setIsLoading(false);
        }
      };

      // void så der ikke returneres et promise
      void fetchHall();
    }, [location_pk]);

    return {
      hall,
      isLoading,
      error,
    };
  };

  // ===========================================================
  //                GET INDKØRSEL I VASKEHAL (simuleret)
  // ===========================================================
  const useEntryToWashHall = (hallNumber?: number | null) => {
    const [registered, setRegistered] = useState(false);

    const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

    useEffect(() => {
      if (!hallNumber) {
        setRegistered(false);
        setSecondsRemaining(null);
        return;
      }

      const interval = setInterval(async () => {
        const response = await fetch(`/api/washhall/entry?hall_number=${hallNumber}`);

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        // status på registrering i vaskehal, er defineret i mocks/handlers.ts
        setRegistered(data.registered);

        // opdater nedtælling baseret på serverens beregning af resterende tid
        setSecondsRemaining(data.seconds_remaining);

        // hvis bilen er registreret i vaskehallen, stop interval
        if (data.registered) {
          clearInterval(interval);
        }
      }, 1000);

      // nulstil interval ved unmount for at undgå memory leaks
      return () => clearInterval(interval);
    }, [hallNumber]);

    return {
      registered,
      secondsRemaining,
    };
  };

  // ===========================================================
  //               POST BRUGERS VASKEPROCES
  // ===========================================================
  const postAvailableWashHall = useCallback(
    async ({ wash, startedAt, endedAt, availibleWashHall, locationID }: postWash) => {
      console.log("POST DATA:", {
        wash,
        startedAt,
        endedAt,
        availibleWashHall,
        locationID,
      });

      const userHasSub = await hasSub();

      const response = await fetch(baseUrl + "/reciept", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",

          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          car_wash_location_fk: locationID,

          car_wash_hall_fk: availibleWashHall,

          car_wash_price: userHasSub ? wash.price_subscription : wash.price_single,

          car_wash_type: wash.name,

          car_wash_started_at: startedAt,

          car_wash_ended_at: endedAt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.error || "Failed to save wash");
      }

      const data = await response.json();

      return data;
    },
    [hasSub],
  );

  return {
    postSubscriptionStatus,
    navigateBasedOnStatus,
    deleteSubscription,
    hasSub,
    postAvailableWashHall,
    updateSubscription,
    useSingleWash,
    useWashHallWaitTime,
    useAvailableWashHall,
    useEntryToWashHall,
  };
}

// ===========================================================
//                Vaskehistorik hooks
// ===========================================================
export function useWashHistory() {
  return useQuery({
    queryKey: ["washHistory"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const userPk = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

      if (!userPk) return [];

      const res = await fetch(`${baseUrl}/car-wash-history/user/${userPk}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.car_wash_history ?? [];
    },
  });
}

export function useWashDetail(id: string) {
  return useQuery({
    queryKey: ["washDetail", id],
    gcTime: 0, // Garbage collection time – how long it will be stored in the cache
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/car-wash-history/detail/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ikke fundet");
      return res.json();
    },
    enabled: !!id,
  });
}
