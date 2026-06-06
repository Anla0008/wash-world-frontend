"use client";

// ===========================================================
//                         IMPORTS
// ===========================================================

import Link from "next/link";
import Image from "next/image";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";

import PrimaryButtonAnchorTag from "../buttons/anchortag/PrimaryButtonAnchorTag";

import { useAuth } from "@/hooks/useAuth";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { resolveWaitStatusLabel } from "@/lib/wash/waitTime";

import { CardWashCardProps } from "@/types/CardWashCardProps";
import { WaitStatusLabel } from "@/types/washType";

// ===========================================================
//                    WAIT STATUS STYLE LOGIC
// ===========================================================

// Finder tekstfarve og prikfarve ud fra ventetidsstatus.
function getWaitStatusStyle(status: WaitStatusLabel) {
  if (status === "Kort ventetid") {
    return {
      dotColor: "bg-(--brand-green)",
      textColor: "text-(--brand-green)",
    };
  }

  if (status === "Moderat ventetid") {
    return {
      dotColor: "bg-(--splash)",
      textColor: "text-(--splash)",
    };
  }

  return {
    dotColor: "bg-(--error-red)",
    textColor: "text-(--error-red)",
  };
}

// ===========================================================
//                       COMPONENT START
// ===========================================================

const CarWashCard = ({ city, address, openingHours, image, href, location_pk, waitTimeSeconds }: CardWashCardProps) => {
  // ===========================================================
  //                       FAVORITE LOGIC
  // ===========================================================

  const { addFavorite, removeFavorite } = useAuth();

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const addFavoriteToStore = useFavoritesStore((state) => state.addFavorite);
  const removeFavoriteFromStore = useFavoritesStore((state) => state.removeFavorite);

  const isFavorite = favoriteIds.has(location_pk);

  async function handleFavorite() {
    try {
      if (isFavorite) {
        await removeFavorite(location_pk);
        removeFavoriteFromStore(location_pk);
      } else {
        await addFavorite(location_pk);
        addFavoriteToStore(location_pk);
      }
    } catch (error) {
      console.error("Fejl ved favorit:", error);
    }
  }

  // ===========================================================
  //                       WAIT TIME LOGIC
  // ===========================================================

  const waitStatus = resolveWaitStatusLabel(waitTimeSeconds);
  const waitStatusStyle = getWaitStatusStyle(waitStatus);

  // ===========================================================
  //                       MAP LINK LOGIC
  // ===========================================================

  const googleMapsSearch = `${address}, ${city}`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsSearch)}`;

  // ===========================================================
  //                         RENDER
  // ===========================================================

  return (
    <article className="col-span-2 relative flex gap-3 p-3 bg-(--gray-80) text-foreground rounded-md">
      <Image src={image} alt={`WashWorld ${city}`} width={110} height={110} className="rounded-md object-cover w-27.5 h-27.5" />

      <div className="flex flex-1 flex-col justify-between">
        {/* Top: city and wait status */}
        <div className="flex gap-6 pr-8 items-center">
          <p className="extra-bold">{city}</p>

          <div className="ml-auto flex gap-3">
            <p className={`${waitStatusStyle.textColor} text-[10px]`}>{waitStatus}</p>

            <span className={`h-2 w-2 rounded-full ${waitStatusStyle.dotColor}`} />
          </div>
        </div>

        {/* Middle: opening hours and address */}
        <div className="flex flex-col gap-2 text-sm">
          <p>{openingHours}</p>
          <p>{address}</p>
        </div>

        {/* Bottom: links */}
        <div className="flex items-center gap-8">
          <Link href={href} className="underline text-xs" aria-label={`Læs mere om vaskehallen i ${city}`}>
            Læs mere
          </Link>

          <div className="ml-auto text-white">
            <PrimaryButtonAnchorTag href={googleMapsUrl} target="_blank">
              Vis vej
            </PrimaryButtonAnchorTag>
          </div>
        </div>
      </div>

      {/* Favorite button */}
      <button type="button" onClick={handleFavorite} aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"} className="absolute top-3 right-3 text-2xl text-foreground">
        {isFavorite ? <IoMdHeart /> : <IoIosHeartEmpty />}
      </button>
    </article>
  );
};

export default CarWashCard;
