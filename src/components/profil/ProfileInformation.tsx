"use client";

import ProfileInfoCard from "@/components/profil/ProfileInfoCard";
import SubscriptionCard from "@/components/global/cards/SubscriptionCard";
import DeleteUserButton from "@/components/global/buttons/onClick/DeleteUserButton";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import { DeleteButtonProps } from "@/types/button";
import Link from "next/link";
import { useWash } from "@/hooks/useWash";
import { useSubscriptionStatus } from "@/lib/wash/resolvers";
import Popup from "@/components/global/cards/PopUp";
import { useState } from "react";
import CheckMarkAnimation from "@/components/global/grafik/CheckMarkAnimation";
import { useRouter } from "next/navigation";

export default function ProfileInformation({user_pk, onDeleted,}: DeleteButtonProps) {
const { deleteSubscription } = useWash();
const userSub = useSubscriptionStatus();
const [showPopup, setShowPopup] = useState(false);
const [checkAnimation, setCheckAnimation] = useState(false);
const router = useRouter();

  const handleOpenCancelPopup = () => {
    setShowPopup(true);
  };

  const handleConfirmCancelSubscription = async () => {
    setShowPopup(false);
    await deleteSubscription();
    setCheckAnimation(true);
  };

  const handleCheckAnimationComplete = () => {
    setCheckAnimation(false);
    setShowPopup(false);
    router.push("/profil");
  };

  return (
    <>
    <div>
      
        <Link href="/profil" className="flex items-center gap-2 mb-4">
            <ArrowLeft size={24} />
              Profil
          </Link>

      <h1 className="extra-bold pb-8">Profiloplysninger</h1>

      <ProfileInfoCard />

      <div className="flex flex-col -mr-8 mt-14">
        <h2 className="extra-bold">Abonnementer</h2>
        <SubscriptionCard />

        {userSub.hasSub &&  
        <button className="foreground underline" onClick={handleOpenCancelPopup}>Annuller abonnement</button>
        }

      </div>

      <div className="flex justify-center mt-14">
        <DeleteUserButton user_pk={user_pk} onDeleted={onDeleted} />
      </div>
    </div>
     {/* Bekræftelsespopup — vises når brugeren klikker "Annuller abonnement" */}
      {showPopup && (
        <Popup
          title="Er du sikker?"
          message="Er du sikker på at du vil annullere dit abonnement?"
          onClose={() => setShowPopup(false)}
        >
          <div className="flex gap-4 justify-center">
            <button onClick={() => setShowPopup(false)}>Nej</button>
            <button
              onClick={async () => {
                await handleConfirmCancelSubscription();
              }}
              className="bg-(--error-red-transparent) pt-1 pb-1 pr-6 pl-6 rounded-4xl"
            >
              Ja, annuller
            </button>
          </div>
        </Popup>
      )}

      {checkAnimation && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-6">

        <div className="rounded-2xl bg-(--gray-80)/90 px-8 py-10 shadow-2xl">
          <CheckMarkAnimation
            title="Abonnement annulleret!"
            durationMs={1600}
            onComplete={handleCheckAnimationComplete}
          />
        </div>
      </div>
     )}
   </>
  );
}
