"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// Sider der IKKE kræver login
const PUBLIC_ROUTES = ["/", "/sign-up", "/verify", "/reset-password"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // Bruges til at navigere brugeren væk
  const pathname = usePathname(); // Den nuværende URL, fx "/locations"
  const [checking, setChecking] = useState(true); // Viser ingenting mens vi tjekker login (burde måske være en spinner?)

  // Præcist match på ruten, undtagen /verify/ som har et dynamisk segment fx /verify/abc123
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route) || pathname.startsWith("/verify/"); // verify har dynamisk segment fx /verify/abc123

  useEffect(() => {
    setChecking(true);

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route) || pathname.startsWith("/verify/");
    console.log("isPublicRoute:", isPublicRoute);

    // Ikke logget ind og siden kræver login → send til login
    if (!token && !isPublicRoute) {
      console.log("Ingen token, redirecter...");
      router.push("/");
      return;
    }
    setChecking(false); // Kun hvis brugeren må se siden
  }, [pathname]); // Kører hver gang URL'en skifter

  if (checking) return null;
  return <>{children}</>;
}
