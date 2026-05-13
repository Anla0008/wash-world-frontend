"use client";

import { useCallback } from "react";
import { User } from "@/types/user";

export function useAuth() {
  const baseUrl = "http://127.0.0.1";

  // ===========================================================
  //                          SIGNUP
  // ===========================================================
  const signup = useCallback(async (params: User) => {
    const response = await fetch(baseUrl + "/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to signup");
    }
  }, []);

  // ===========================================================
  //                          LOGIN
  // ===========================================================
  const login = useCallback(async (params: User) => {
    const response = await fetch(baseUrl + "/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }
  }, []);

  // ===========================================================
  //                          LOCATIONS
  // ===========================================================
  const getLocations = useCallback(async () => {
    const response = await fetch(baseUrl + "/locations");

    if (!response.ok) {
      throw new Error("Failed to get locations");
    }

    const data = await response.json();
    return data.locations;
  }, []);

  // Herunder returnerer vi ALLE routes, som vi ønsker at kunne bruge i vores komponenter
  return { signup, login, getLocations };
}
