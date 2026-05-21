"use client";
import Home from "@/components/global/icons/navbar/Home";
import Profile from "@/components/global/icons/navbar/Profile";
import Wash from "@/components/global/icons/navbar/Wash";
import Map from "../icons/navbar/Map";
import Favourites from "../icons/navbar/Favourites";
import { usePathname } from "next/navigation";
import { getUser } from "@/hooks/useAuth";
import { WashRoute } from "@/types/washType";
import { resolveWashRouteFromDistance, useNearestWash } from "@/lib/wash/resolvers";

// Routes hvor navbar skal være skjult
const hiddenRoutes = ["/", "/sign-up", "/verify", "/reset-password"];

const NavBar = () => {
  const { getUserData } = getUser();
  const { nearestDistanceKm } = useNearestWash();

  const pathname = usePathname();

  // Hvis den aktuelle rute er i listen over skjulte ruter, returner null for IKKE at vise navbar
  if (hiddenRoutes.includes(pathname)) return null;

  const user = getUserData();
  const washRoute: WashRoute = nearestDistanceKm !== null ? resolveWashRouteFromDistance(nearestDistanceKm, user.has_sub) : "/error-in-distance";

  const li = [
    {
      name: "Hjem",
      link: "/dashboard",
      icon: <Home size={40} color={pathname === "/dashboard" ? "var(--brand-green-reverse)" : "var(--background)"} />,
    },
    {
      name: "Kort",
      link: "/locations",
      icon: <Map size={40} color={pathname === "/locations" ? "var(--brand-green-reverse)" : "var(--background)"} />,
    },
    {
      name: "Favoritter",
      link: "/favoritter",
      icon: <Favourites size={40} color={pathname === "/favoritter" ? "var(--brand-green-reverse)" : "var(--background)"} />,
    },
    {
      name: "Profil",
      link: "/profil",
      icon: <Profile size={40} color={pathname === "/profil" ? "var(--brand-green-reverse)" : "var(--background)"} />,
    },
  ];

  return (
    <nav
      className="w-full px-10 bg-foreground/80 backdrop-blur-3xl py-2 z-100"
      style={{
        boxShadow: "inset -5px -5px 15px #06C167, inset 30px 30px 10px #f1f1f1",
      }}
    >
      <ul className="flex justify-between items-center relative">
        <li className="flex flex-col items-center justify-center">
          <a href={li[0].link}>{li[0].icon}</a>
          <span className="flex items-center text-background">{li[0].name}</span>
        </li>

        <li className="flex flex-col items-center justify-center">
          <a href={li[1].link}>{li[1].icon}</a>
          <span className="flex items-center text-background">{li[1].name}</span>
        </li>

        {/* mere space omkring wash-knappen */}
        <li className="w-20" />

        <li className="flex flex-col items-center justify-center">
          <a href={li[2].link}>{li[2].icon}</a>
          <span className="flex items-center text-background">{li[2].name}</span>
        </li>

        <li className="flex flex-col items-center justify-center">
          <a href={li[3].link}>{li[3].icon}</a>
          <span className="flex items-center text-background">{li[3].name}</span>
        </li>

        <li className="bg-foreground flex flex-col items-center justify-center rounded-full p-3 border-5 border-background absolute left-1/2" style={{ transform: "translate(-50%, -35%)" }}>
          <a href={washRoute} aria-label="vask">
            <Wash size={50} color={pathname === washRoute ? "var(--brand-green-reverse)" : "var(--background)"} />
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
