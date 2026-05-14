"use client";
import { useEffect, useState } from "react";

export default function MswInitializer({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(
    process.env.NODE_ENV !== "development" ||
    process.env.NEXT_PUBLIC_ENABLE_MSW === "false"
  );

  useEffect(() => {
    if (mswReady) return;

    import("@/mocks/browser")
      .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
      .then(() => setMswReady(true))
      .catch(console.error);
  }, []);

  if (!mswReady) return null; // eller en spinner

  return <>{children}</>;
}