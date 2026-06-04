"use client";

import Link from "next/link";
import Image from "next/image";
import PrimaryButtonAnchorTag from "../buttons/anchortag/PrimaryButtonAnchorTag";
// import useRandomWaitStatus from "@/hooks/useRandomWaitStatus";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { CardWashCardProps } from "@/types/CardWashCardProps";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { resolveWaitStatusLabel } from "@/lib/wash/waitTime";
import { WaitStatusLabel } from "@/types/washType";

const statusStyles: Record<WaitStatusLabel, { dotColor: string; textColor: string }> = {
  "Kort ventetid": {
    dotColor: "bg-(--brand-green)",
    textColor: "text-(--brand-green)",
  },
  "Moderat ventetid": {
    dotColor: "bg-(--splash)",
    textColor: "text-(--splash)",
  },
  "Lang ventetid": {
    dotColor: "bg-(--error-red)",
    textColor: "text-(--error-red)",
  },
};

const CarWashCard = ({ city, address, openingHours, image, href, location_pk, waitTimeSeconds }: CardWashCardProps) => {
  const { addFavorite, removeFavorite } = useAuth();
  const status = resolveWaitStatusLabel(waitTimeSeconds);

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const storeAdd = useFavoritesStore((state) => state.addFavorite);
  const storeRemove = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = favoriteIds.has(location_pk);

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFavorite(location_pk);
        storeRemove(location_pk);
      } else {
        await addFavorite(location_pk);
        storeAdd(location_pk);
      }
    } catch (error) {
      console.error("Fejl ved favorit:", error);
    }
  };

  const resolvedStatusStyle = statusStyles[status];

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, ${city}`)}`;

  return (
    <article className="col-span-2 relative flex gap-3 p-3 bg-(--gray-80) text-foreground rounded-md">
      <Image src={image} alt={`WashWorld ${city}`} width={110} height={110} className="rounded-md object-cover w-27.5 h-27.5" />

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex gap-6 pr-8 items-center">
          <p className="extra-bold">{city}</p>

          <div className="ml-auto flex gap-3">
            <p className={`${resolvedStatusStyle.textColor} text-[10px]`}>{status}</p>
            <span className={`h-2 w-2 rounded-full ${resolvedStatusStyle.dotColor}`}></span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <p>{openingHours}</p>
          <p>{address}</p>
        </div>

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

      <button type="button" onClick={handleFavorite} aria-label={isFavorite ? "Fjern fra favoritter" : "Tilføj til favoritter"} className="absolute top-3 right-3 text-2xl text-foreground">
        {isFavorite ? <IoMdHeart /> : <IoIosHeartEmpty />}
      </button>
    </article>
  );
};

export default CarWashCard;
