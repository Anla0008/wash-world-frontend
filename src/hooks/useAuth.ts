"use client";

import { useCallback } from "react";
import { User } from "@/types/user";

export function useAuth() {
  const baseUrl = "http://localhost:8080";

  // ===========================================================
  //                          SIGNUP
  // ===========================================================

  // Vi bruger User fra types, hvor alt er sat til string
  const signup = useCallback(async (params: User) => {
    const response = await fetch(baseUrl + "/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to signup");
    }

    return response.json();
  }, []);

  // ===========================================================
  //                          LOGIN
  // ===========================================================
  const login = useCallback(async (params: User) => {
    const response = await fetch(baseUrl + "/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error("Failed to signup");
    }

    return response.json();
  }, []);

  return { signup };
}
