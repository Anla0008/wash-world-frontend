"use client";

import PrimaryButton from "../global/buttons/onClick/PrimaryButton";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import { useRouter } from "next/navigation";
import ProgressBar from "../global/grafik/ProgressBar";
import { useState } from "react";
import CheckMarkAnimation from "../global/grafik/CheckMarkAnimation";
import { useSubscriptionStatus } from "@/lib/wash/resolvers";

const Reciept = () => {
  const [checkAnimation, setCheckAnimation] = useState(false);
  const [nextRoute, setNextRoute] = useState<"/dashboard" | "/feedback">("/dashboard");
  const userHasSub = useSubscriptionStatus();

  const router = useRouter();

  const { postAvailableWashHall } = useWash();

  const { selectedWash, startedAt, endedAt, availibleWashHall, locationID, locationName, clearWash } = useWashStore();

  // ===========================================================
  //                   AFSLUT VASK
  // ===========================================================

  // animation som trigger push route til dashboard
  const handleCheckAnimationComplete = () => {
    setCheckAnimation(false);
    clearWash();
    router.push(nextRoute);
  };

  const handleClick = async () => {
    if (!selectedWash) return;
    
    // trigger animation
    setNextRoute("/dashboard");
    setCheckAnimation(true);

    // post til backend
    await postAvailableWashHall({
      wash: selectedWash,
      startedAt,
      endedAt,
      availibleWashHall,
      locationID,
    });

  };
  //
  // ===========================================================
  //                   AFSLUT VASK MED FEEDBACK
  // ===========================================================

  // animation som trigger push route til feedback
  const handleClickFeedback = async () => {
    if (!selectedWash) return;

    // post til backend
    await postAvailableWashHall({
      wash: selectedWash,
      startedAt,
      endedAt,
      availibleWashHall,
      locationID,
    });

    // trigger animation
    setNextRoute("/feedback");
    setCheckAnimation(true);
  };

  // ===========================================================
  //                  DATO & TID
  // ===========================================================

  // new Date-objekt til omkoncverteret starttidspunkt hvis starttidspunkt er tilgængelig
  const startDate = startedAt ? new Date(startedAt) : null;

  // endDate er baseret på starttidspunkt + varighed af valgt vask, hvis begge dele er tilgængelige
  const endDate = startedAt && selectedWash ? new Date(startedAt + selectedWash.duration * 1000) : null;

  return (
    <>
      <div className="flex flex-col gap-10">
        <ProgressBar activeIndex={3} isWashProcess={true} />

        <div className="flex flex-col">
          <h1 className="extra-bold">{startDate?.toLocaleDateString("da-DK")}</h1>
          <p>Tak fordi du vasker hos os!</p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="extra-bold">Din vask</h2>

          <div className="flex gap-2">
            <p className="extra-bold">Dato:</p>
            <p>{startDate?.toLocaleDateString("da-DK")}</p>
          </div>

          <div className="flex gap-2">
            <p className="extra-bold">Starttidspunkt:</p>
            <p>
              {startDate?.toLocaleTimeString("da-DK", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex gap-2">
            <p className="extra-bold">Sluttidspunkt:</p>

            <p>
              {endDate?.toLocaleTimeString("da-DK", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex gap-2">
            <p className="extra-bold">Vasktype:</p>
            <p>{selectedWash?.name}</p>
          </div>

          <div className="flex gap-2">
            <p className="extra-bold">Pris:</p>

            {userHasSub.hasSub ? <p>{selectedWash?.price_subscription} kr. / måned</p> : <p>{selectedWash?.price_single} kr.</p>}
          </div>

          <div className="flex gap-2">
            <p className="extra-bold">Lokation:</p>
            <p>
              Hal {availibleWashHall} - {locationName}
            </p>
          </div>
        </div>

        <PrimaryButton onClick={handleClick}>Afslut</PrimaryButton>
        <button className="underline" onClick={handleClickFeedback}>
          Send feedback
        </button>
      </div>

      {checkAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-6">
          <div className="rounded-2xl bg-(--gray-80)/90 px-8 py-10 shadow-2xl">
            <CheckMarkAnimation title="Afsluttet!" subtitle="Din vask er betalt!" durationMs={1600} onComplete={handleCheckAnimationComplete} />
          </div>
        </div>
      )}
    </>
  );
};

export default Reciept;
