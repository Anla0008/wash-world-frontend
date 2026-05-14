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


// ===========================================================
//                      GET LOGGED IN USER
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
  license_plate: "ABC123",
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