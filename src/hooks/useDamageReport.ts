"use client";

import { useCallback } from "react";

export function useDamageReport() {
  const baseUrl = "http://127.0.0.1:80";

  // Sends a damage report to the backend, which forwards it as an email to Washworld
  const sendDamageReport = useCallback(async (description: string, user_email: string) => {
    const response = await fetch(baseUrl + "/skaderapportering", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ description, user_email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send damage report");
    }

    return response.json();
  }, []);

  return { sendDamageReport };
}
