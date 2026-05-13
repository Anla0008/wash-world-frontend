"use client";

import { useEffect } from "react";

export default function MswInitializer() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const enableMsw = process.env.NEXT_PUBLIC_ENABLE_MSW !== "false";

    if (!enableMsw) {
      return;
    }

    import("@/mocks/browser")
      .then(({ worker }) => {
        worker.start({ onUnhandledRequest: "bypass" });
      })
      .catch((error) => {
        console.error("Failed to start MSW worker", error);
      });
  }, []);

  return null;
}
