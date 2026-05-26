"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import CheckMarkAnimation from "@/components/global/grafik/CheckMarkAnimation";
import SingleViewCard from "@/components/wash/SingleView";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";

const WashSingleViewPage = () => {
  const { useSingleWash } = useWash();
  const { setSelectedWash } = useWashStore();
  const { data } = useSingleWash();

  const { id } = useParams();
  const router = useRouter();
  const [checkAnimation, setCheckAnimation] = useState(false);

  const handleCheckAnimationComplete = () => {
    router.push("/waiting-line");
  };

  const wash = data?.types.find((wash) => String(wash.id) === String(id));

  if (!data) {
    return <p>Henter vaskedetaljer...</p>;
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

  const handleSelectWash = () => {
    setSelectedWash(wash);
    setCheckAnimation(true);
  };

  return (
    <>
       <Link href="/buy-wash" className="flex items-center gap-2 mb-4">
          <ArrowLeft size={24} />
              Enkeltvaske
          </Link>

      <SingleViewCard wash={wash} isSubscription={false} onSelect={handleSelectWash} />

      {checkAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-6">
          <div className="rounded-2xl bg-(--gray-80)/90 px-8 py-10 shadow-2xl">
            <CheckMarkAnimation
              title="Vask valgt!"
              subtitle="Din vask vil faktureres når den er afsluttet"
              durationMs={1600}
              onComplete={handleCheckAnimationComplete}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default WashSingleViewPage;
