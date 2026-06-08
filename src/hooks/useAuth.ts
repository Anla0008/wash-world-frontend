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
  //        SIGNUP - tjek email + plate inden oprettelse
  // ===========================================================
  // // Async = funktionen venter på et svar fra serveren
  const checkEmail = useCallback(async (email: string) => {
    const response = await fetch(baseUrl + "/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // fortæller serveren at vi sender JSON
      body: JSON.stringify({ user_email: email }), // oversætter JavaScript-objekt til string som serveren kan læse
    });

    const data = await response.json(); // Læser svaret fra serveren og oversætter det fra tekst tilbage til et JavaScript-objekt
    return { ok: response.ok, data }; // data er selve svaret fra serveren
  }, []);

  const checkPlate = useCallback(async (plate: string) => {
    const response = await fetch(baseUrl + "/check-plate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate_number: plate }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }, []);

  // ===========================================================
  //               SEND VERIFICATION EMAIL IGEN
  // ===========================================================
  const resendVerification = useCallback(async (params: User) => {
    const response = await fetch(baseUrl + "/resend-verification", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await response.json();
    return { ok: response.ok, data };
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
    localStorage.setItem("user_first_name", data.user_first_name); // Gemmer firstname som kan bruges på dashboard
    localStorage.setItem("user_email", data.user_email); // Gemmer email som kan bruges til skaderapportering
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

    // Logger hvad backenden svarer så vi kan se hvad der fejler, hvis noget fejler
    console.log("Status:", response.status);
    console.log("Body:", data);

    return { ok: response.ok, data };
  }, []);

  // ===========================================================
  //                      RESET PASSWORD
  // ===========================================================

  const resetPassword = useCallback(async (params: User, key: string) => {
    const response = await fetch(baseUrl + `/reset-password/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_hashed_password: params.user_hashed_password,
        confirm_password: params.user_repeat_hashed_password,
      }),
    });

    const data = await response.json();
    return { ok: response.ok, data };
  }, []);

  const validateResetKey = useCallback(async (key: string) => {
    // Denne route skal bare tjekke om reset key er valid, og returnere 200 hvis den er valid, og 400 hvis den ikke er valid.
    // Vi har ikke brug for at sende noget body i denne request, da vi bare skal tjekke om key er valid.
    const response = await fetch(baseUrl + `/reset-password/${key}`);
    const data = await response.json();
    return { ok: response.ok, data };
  }, []);

  // ===========================================================
  //                  GET PROFILE INFORMATION
  // ===========================================================
  const getProfileInfo = useCallback(async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(baseUrl + "/profile-information", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //frontend sender token i header for at backend kan validere og returnere brugerdata hvis token er gyldigt
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) return null;
    return data.user;
  }, []);

  // ===========================================================
  //                 PATCH PROFILE INFORMATION
  // ===========================================================
  const updateProfileInfo = useCallback(
    async (params: {
      user_first_name: string;
      user_last_name: string;
      user_email: string;
    }) => {
      const token = localStorage.getItem("token");

      const response = await fetch(baseUrl + "/profile-information", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      console.log("Status:", response.status);
      console.log("Body:", data);
      return data;
    },
    [],
  );

  // ===========================================================
  //                          LOCATIONS
  // ===========================================================
  const getLocations = useCallback(async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(baseUrl + "/locations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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
    const token = localStorage.getItem("token");

    const response = await fetch(baseUrl + `/locations/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

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

  // ===========================================================
  //                       DELETE USER
  // ===========================================================
  const deleteUser = useCallback(async () => {
    const response = await fetch(baseUrl + "/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    localStorage.removeItem("token");
    return response.json();
  }, []);

  // Herunder returnerer vi ALLE routes, som vi ønsker at kunne bruge i vores komponenter
  return {
    signup,
    checkEmail,
    checkPlate,
    resendVerification,
    verify,
    login,
    forgotPassword,
    resetPassword,
    getProfileInfo,
    updateProfileInfo,
    validateResetKey,
    getLocations,
    getSingleLocation,
    getFavorites,
    addFavorite,
    removeFavorite,
    deleteUser,
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
