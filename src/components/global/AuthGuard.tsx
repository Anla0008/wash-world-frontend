"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Sider der IKKE kræver login
const PUBLIC_ROUTES = [
  "/",
  "/sign-up",
  "/verify",
  "/reset-password",
  "/forgot-password",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // Bruges til at navigere brugeren væk
  const pathname = usePathname(); // Den nuværende URL, fx "/locations"
  const [checking, setChecking] = useState(true); // Viser ingenting mens vi tjekker login

  useEffect(() => {
    setChecking(true);

    const token = localStorage.getItem("token");

    // Præcist match på ruten, undtagen /verify/ og /reset-password/ som har dynamiske segmenter
    const isPublicRoute =
      PUBLIC_ROUTES.some((route) => pathname === route) ||
      pathname.startsWith("/verify/") ||
      pathname.startsWith("/reset-password/") ||
      pathname.startsWith("/forgot-password/");

    // Ikke logget ind og siden kræver login → send til login
    if (!token && !isPublicRoute) {
      router.push("/");
      return;
    }

    setChecking(false); // Kun hvis brugeren må se siden
  }, [pathname]); // Kører hver gang URL'en skifter

  if (checking) return null;
  return <>{children}</>;
}
