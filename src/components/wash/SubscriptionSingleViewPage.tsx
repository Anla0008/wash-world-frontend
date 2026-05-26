"use client";

import Link from "next/link";
import { useState } from "react";

import Popup from "@/components/global/cards/PopUp";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import SingleViewCard from "@/components/wash/SingleView";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";

type SubscriptionSingleViewPageProps = {
  id: string;
};

export default function SubscriptionSingleViewPage({ id }: SubscriptionSingleViewPageProps) {
  const { useSingleWash, postSubscriptionStatus, updateSubscription, getSubscriptionStatus } = useWash();

  const { setSelectedWash } = useWashStore();

  const { data } = useSingleWash();

  const [popUp, setPopUp] = useState(false);

  const wash = data?.types.find((item) => String(item.id) === String(id));

  if (!data) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-foreground">
        <p>Indlæser vask...</p>
      </main>
    );
  }

  if (!wash) {
    return (
      <main className="min-h-screen bg-background px-8 py-10 text-foreground">
        <p>Vasken blev ikke fundet.</p>

        <Link href="/buy-wash" className="mt-4 inline-block underline">
          Tilbage til oversigt
        </Link>
      </main>
    );
  }

  const handleSelectWash = async () => {
    setSelectedWash(wash);
    setPopUp(true);

    const alreadyHasSubscription = await getSubscriptionStatus().then((status) => status?.has_sub ?? false);

    if (alreadyHasSubscription) {
      await updateSubscription(true, wash.name);
      return;
    }

    await postSubscriptionStatus({ has_sub: true } as any, wash);
  };

  return (
    <>
      <Link href="/buy-wash" className="mt-4 underline flex items-center gap-2">
        <ArrowLeft size={20} color="var(--foreground)" />
      </Link>

      <SingleViewCard wash={wash} isSubscription={true} onSelect={handleSelectWash} />

      {popUp && (
        <Popup
          title="Abonnement købt!"
          message={`${"Abonnement løber fra"} ${new Date().toLocaleDateString()} - ${new Date(new Date().setDate(new Date().getDate() + 31)).toLocaleDateString()}`}
          submessage="Du vil blive trukket automatisk for enden af perioden."
          onClose={() => setPopUp(false)}
        />
      )}
    </>
  );
}
