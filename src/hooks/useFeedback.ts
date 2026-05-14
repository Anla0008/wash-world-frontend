"use client";

import { useCallback } from "react";
import { FeedbackProps } from "@/types/feedback";

// ===========================================================
//                       SEND FEEDBACK
// ===========================================================

export function useFeedback() {
  const baseUrl = "http://127.0.0.1";

  const sendFeedback = useCallback(async (params: FeedbackProps) => {
    const response = await fetch(baseUrl + "/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Server svarede med:", response.status, errorBody);
      throw new Error("Failed to send feedback");
    }

    return await response.json();
  }, []);

  return { sendFeedback };
}
