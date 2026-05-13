"use client";
import { WashRoute } from "@/types/wash";
import { useCallback } from "react";
import { User } from "@/types/user";


export function useWash() {

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