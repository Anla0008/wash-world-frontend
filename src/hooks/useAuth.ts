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

    // Læs body'en én gang og gem i variabel
    const data = await response.json();

    // Logger hvad backenden svarer så vi kan se hvad der fejler
    console.log("Status:", response.status);
    console.log("Body:", data);

    return data;
  }, []);

  // ===========================================================
  //                          VERIFY
  // ===========================================================
  const verify = useCallback(async (key: string) => {
    const response = await fetch(baseUrl + `/verify/${key}`);
    if (!response.ok) {
      throw new Error("Failed to verify");
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
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return { error: "Failed to login" };
    }

    const data = await response.json();
    console.log(data);
    localStorage.setItem("token", data.access_token); // Gemmer token i localStorage ved login
    return data;
  }, []);

  // ===========================================================
  //                      FORGOT PASSWORD
  // ===========================================================
  const forgotPassword = useCallback(async (params: User) => {
    const response = await fetch(baseUrl + "/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Body:", data);

    return { ok: response.ok, data };
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

  // ===========================================================
  //                      SINGLE LOCATION
  // ===========================================================
  const getSingleLocation = useCallback(async (id: string) => {
    const response = await fetch(baseUrl + `/locations/${id}`);

    if (!response.ok) {
      throw new Error("Failed to get single location");
    }

    const data = await response.json();
    return data.location;
  }, []);

  // ===========================================================
  //                        GET FAVORITES
  // ===========================================================
  const getFavorites = useCallback(async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(baseUrl + "/favorites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get favorites");
    }

    const data = await response.json();
    return data.favorites;
  }, []);

  // ===========================================================
  //                        ADD FAVORITE
  // ===========================================================
  const addFavorite = useCallback(async (location_pk: string) => {
    const token = localStorage.getItem("token");

    const response = await fetch(baseUrl + "/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        location_pk: location_pk,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }

    return await response.json();
  }, []);

  // ===========================================================
  //                       REMOVE FAVORITE
  // ===========================================================
  const removeFavorite = useCallback(async (location_pk: string) => {
    const token = localStorage.getItem("token");

    const response = await fetch(baseUrl + `/favorites/${location_pk}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }

    return await response.json();
  }, []);

  // Herunder returnerer vi ALLE routes, som vi ønsker at kunne bruge i vores komponenter
  return {
    signup,
    verify,
    login,
    forgotPassword,
    getLocations,
    getSingleLocation,
    getFavorites,
    addFavorite,
    removeFavorite,
  };
}

// ===========================================================
//            GET LOGGED IN USER (ONLY TEST PURPOSE)
// ===========================================================

export function getUser() {
  // Simuleret brugerdata
  const user: User = {
    // TODO: skal være indhold fra logget ind bruger
    user_email: "user_email",
    user_first_name: "Test",
    user_last_name: "User",
    user_hashed_password: "hashed_password",
    user_repeat_hashed_password: "hashed_password",
    plate_number: "ABC123",
    has_sub: true,
  };

  const hasSubscription = Math.random() < 0.5; // simulerer abbonoment til at være enten true eller false

  // Funktion til at hente brugerdata (simuleret)
  const getUserData = () => {
    return { ...user, has_sub: hasSubscription };
  };

  return {
    getUserData,
  };
}
