"use client";
import Home from "@/components/global/icons/navbar/Home";
import Profile from "@/components/global/icons/navbar/Profile";
import Wash from "@/components/global/icons/navbar/Wash";
import Map from "../icons/navbar/Map";
import Favourites from "../icons/navbar/Favourites";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();

    const li = [
        {
            name: "dashboard",
            link: "/",
            icon: (
                <Home
size={40}
                    color={
                        pathname === "/"
                            ? "var(--brand-green-reverse)"
                            : "var(--background)"
                    }
                />
            ),
        },
        {
            name: "kort",
            link: "/kort",
            icon: (
                <Map
                    size={40}
                    color={
                        pathname === "/kort"
                            ? "var(--brand-green-reverse)"
                            : "var(--background)"
                    }
                />
            ),
        },
        {
            name: "favoritter",
            link: "/favoritter",
            icon: (
                <Favourites
                    size={40}
                    color={
                        pathname === "/favoritter"
                            ? "var(--brand-green-reverse)"
                            : "var(--background)"
                    }
                />
            ),
        },
        {
            name: "profil",
            link: "/profil",
            icon: (
                <Profile
                    size={40}
                    color={
                        pathname === "/profil"
                            ? "var(--brand-green-reverse)"
                            : "var(--background)"
                    }
                />
            ),
        },
    ];

    return (
        <nav className="fixed bottom-0 w-screen px-10 bg-foreground/80 backdrop-blur-3xl py-2 z-50"
         style={{
                boxShadow: "inset -5px -5px 15px #06C167, inset 30px 30px 10px #f1f1f1"
            }}
        >
            <ul className="flex justify-between items-center relative">
                <li><a href={li[0].link}>{li[0].icon}</a></li>

                <li><a href={li[1].link}>{li[1].icon}</a></li>

                {/* mere space omkring wash-knappen */}
                <li className="w-20" />

                <li><a href={li[2].link}>{li[2].icon}</a></li>

                <li><a href={li[3].link}>{li[3].icon}</a></li>

                <li
                    className="bg-foreground rounded-full p-3 border-5 border-background absolute left-1/2"
                    style={{ transform: "translate(-50%, -35%)" }}
                >
                    <a href="/vask" aria-label="vask">
                        <Wash size={50}  color={
                        pathname === "/vask"
                            ? "var(--brand-green-reverse)"
                            : "var(--background)"
                    } />
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;