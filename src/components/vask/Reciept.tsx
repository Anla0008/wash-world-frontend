"use client";

import PrimaryButton from "../global/buttons/onClick/PrimaryButton";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import { useRouter } from "next/navigation";

const Reciept = () => {

  const router = useRouter();

  const { postAvailableWashHall } = useWash();

const {
  selectedWash,
  startedAt,
  endedAt,
  clearWash,
} = useWashStore();

  // ===========================================================
  //                   AFSLUT VASK
  // ===========================================================

  const handleClick = async () => {

    if (!selectedWash) return;

   await postAvailableWashHall({
        wash: selectedWash,
        startedAt,
        endedAt,
        });

    clearWash();

    router.push("/");
  };

  // ===========================================================
  //                  DATO & TID
  // ===========================================================

  const startDate = startedAt
    ? new Date(startedAt)
    : null;

  const endDate =
    startedAt && selectedWash
      ? new Date(
          startedAt + selectedWash.duration * 1000
        )
      : null;

  return (
    <div className="flex flex-col gap-10">

      <div className="flex flex-col gap-2">
        <h1 className="extra-bold">
          Tak fordi du vasker med os!
        </h1>

        <p>
          Din vask er nu færdig.
        </p>
      </div>

      <div className="flex flex-col gap-5">

        <h2 className="extra-bold">
          Din vask
        </h2>

        <div className="flex gap-2">
          <p className="extra-bold">Dato:</p>

          <p>
            {startDate?.toLocaleDateString("da-DK")}
          </p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">
            Starttidspunkt:
          </p>

          <p>
            {startDate?.toLocaleTimeString("da-DK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">
            Sluttidspunkt:
          </p>

          <p>
            {endDate?.toLocaleTimeString("da-DK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">
            Vasktype:
          </p>

          <p>
            {selectedWash?.name}
          </p>
        </div>

        <div className="flex gap-2">
          <p className="extra-bold">
            Pris:
          </p>

          <p>
            {selectedWash?.price} kr.
          </p>
        </div>

      </div>

      <PrimaryButton onClick={handleClick}>
        Afslut
      </PrimaryButton>

    </div>
  );
};

export default Reciept;