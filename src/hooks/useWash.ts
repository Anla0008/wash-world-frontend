"use client";
import { WashRoute, SingleWashType, WashingHalls, WashHallWaitTimeResponse } from "@/types/washType";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import { resolveWaitTime } from "@/lib/wash/resolvers";
import { postWash } from "@/types/washType";

export function useWash() {
  const baseUrl = "http://127.0.0.1:80";

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
  const hasSub = useCallback(async () => {
    const response = await fetch(baseUrl + "/subscription/status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      return {
        has_sub: false,
        sub_type: null,
      };
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

    return userHasSub ? "/active-wash" : "/buy-wash";
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
  const postAvailableWashHall = useCallback(async ({ wash, startedAt, endedAt, availibleWashHall, locationID }: postWash) => {
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
  }, []);

  // ===========================================================
  //                Vaskehistorik hooks
  // ===========================================================
  const useWashHistory = () => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const userPk = JSON.parse(atob(token.split(".")[1])).sub;

      fetch(`${baseUrl}/car-wash-history/user/${userPk}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Fetch fejl");
          return res.json();
        })
        .then((data) => setHistory(data.car_wash_history ?? [])) // fallback til tom array
        .catch((err) => console.error("Fetch fejl:", err));
    }, []);

    return history;
  };

  const useWashDetail = (id: string) => {
    const [wash, setWash] = useState<any | null>(null);

    useEffect(() => {
      if (!id) return;

      const token = localStorage.getItem("token");

      fetch(`${baseUrl}/car-wash-history/detail/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Ikke fundet");
          return res.json();
        })
        .then((data) => setWash(data ?? null)) // fallback til null
        .catch((err) => console.error(err));
    }, [id]);

    return wash;
  };

  return {
    postSubscriptionStatus,
    navigateBasedOnStatus,
    hasSub,
    postAvailableWashHall,
    useSingleWash,
    useWashHallWaitTime,
    useAvailableWashHall,
    useEntryToWashHall,
    useWashHistory,
    useWashDetail,
  };
}
