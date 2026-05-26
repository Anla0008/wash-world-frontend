"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import SingleViewCard from "@/components/wash/SingleView";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import Popup from "@/components/global/cards/PopUp";
import CheckMarkAnimation from "@/components/global/grafik/CheckMarkAnimation";
import { useSubscriptionStatus } from "@/lib/wash/resolvers";

export default function SubscriptionSingleView() {
  const { useSingleWash } = useWash();
  const { setSelectedWash } = useWashStore();
  const { postSubscriptionStatus } = useWash();
  const { data } = useSingleWash();
  const [popUp, setPopUp] = useState(false);
  const [checkAnimation, setCheckAnimation] = useState(false);

  const { id } = useParams();
  const router = useRouter();

  const wash = data?.types.find((wash) => String(wash.id) === String(id));

  if (!data) {
    return (
        <p>Indlæser vask...</p>
    );
  }

  if (!wash) {
    return (
        <p>Vasken blev ikke fundet.</p>
    );
  }

  const handleSelectWash = () => {
    setSelectedWash(wash);
    setCheckAnimation(true);
  };

  const handleCheckAnimationComplete = () => {
    setCheckAnimation(false);
    setPopUp(true);
    postSubscriptionStatus({ has_sub: true } as any, wash);
  };

  const handleClosePopup = () => {
    setPopUp(false);
    router.push("/profil");
  }
  
  return (
    <>
    <Link href="/profile-information" className="flex items-center gap-2 mb-4">
       <ArrowLeft size={20} color="var(--foreground)" />
       Abonnementer
    </Link>
    <SingleViewCard wash={wash} isSubscription={true} onSelect={handleSelectWash} />

      {checkAnimation && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-6">

        <div className="rounded-2xl bg-(--gray-80)/90 px-8 py-10 shadow-2xl">
          <CheckMarkAnimation
            title="Abonnement valgt!"
            durationMs={1600}
            onComplete={handleCheckAnimationComplete}
          />
        </div>
      </div>
    )}

    {popUp && (
      <Popup
        title="Abonnement købt!"
        message={`Abonnoment løber fra ${new Date().toLocaleDateString()} - ${new Date(new Date().setDate(new Date().getDate() + 31)).toLocaleDateString()}`}
        submessage="Du vil blive trukket automatisk for enden af perioden."
        onClose={handleClosePopup}
      />
    )}
    </>
  );
}