"use client";

import { useWash } from "@/hooks/useWash";
import PrimaryButton from "../global/buttons/onClick/PrimaryButton";
import { useRouter } from "next/navigation";
import { useWashStore } from "@/stores/useWashStore";
import { WashType } from "@/types/washType";
import Swipe from "../global/buttons/onClick/Swipe";
import { useState } from "react";
import CheckMarkAnimation from "../global/grafik/CheckMarkAnimation";

export default function SingleWash() {
  const { useSingleWash } = useWash();
  const { setSelectedWash } = useWashStore();
  const [active, setActive] = useState(false);
  const [selectedWashId, setSelectedWashId] = useState<WashType["id"] | null>(null);
  const [checkAnimation, setCheckAnimation] = useState(false);

  const { data } = useSingleWash();

  const router = useRouter();

  if (!data) {
    return <p>Loading...</p>;
  }

  const toggleActiveSwipe = (wash: WashType) => {
    const isSameWash = selectedWashId === wash.id;

    if (isSameWash && active) {
      setActive(false);
      setSelectedWashId(null);
      return;
    }

    setSelectedWash(wash);
    setSelectedWashId(wash.id);
    setActive(true);
  };

  const handleSwipeComplete = () => {
    setActive(false);
    setCheckAnimation(true);
  };

  const handleCheckAnimationComplete = () => {
    router.push("/waiting-line");
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <ul className="flex flex-col gap-5">
          {data.types.map((wash) => (
            <li className="flex flex-col gap-5 bg-(--gray-80) rounded-lg p-4" key={wash.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="extra-bold">{wash.name}</h2>
                  <p>{wash.sub_title}</p>
                </div>

                <div className="flex gap-2 items-baseline extra-bold">
                  <h1>{wash.price_single}</h1>
                  <span>kr.</span>
                </div>
              </div>

              <div className="flex w-full items-center justify-end gap-5">
                <a className="underline" href={`/wash-single-view/${wash.id}`}>
                  Læs mere
                </a>

                <PrimaryButton onClick={() => toggleActiveSwipe(wash)}>Vælg</PrimaryButton>
              </div>
            </li>
          ))}
        </ul>

        <Swipe disabled={!active} onComplete={handleSwipeComplete}>
          Vask
        </Swipe>
      </div>

      {checkAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-6">
          <div className="rounded-2xl bg-(--gray-80)/90 px-8 py-10 shadow-2xl">
            <CheckMarkAnimation title="Kob gennemført!" subtitle="Dit kob er registreret" durationMs={1600} onComplete={handleCheckAnimationComplete} />
          </div>
        </div>
      )}
    </>
  );
}
