"use client";

import PrimaryButton from "../global/buttons/onClick/PrimaryButton";
import { useWash } from "@/hooks/useWash";
import { useWashStore } from "@/stores/useWashStore";
import { useRouter } from "next/navigation";
import ProgressBar from "../global/grafik/ProgressBar";

const Reciept = () => {

  const router = useRouter();

  const { postAvailableWashHall } = useWash();

const {
  selectedWash,
  startedAt,
  endedAt,
  availibleWashHall,
  userLocation,
  userLocationObj,
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
      availibleWashHall,
      userLocation,
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
      <ProgressBar
        activeIndex={3}
        isWashProcess={true}
      />

      <div className="flex flex-col">
        <h1 className="extra-bold">
           {startDate?.toLocaleDateString("da-DK")}
        </h1>

        <p>
          Tak fordi du vasker hos os!
        </p>
      </div>

      <div className="flex flex-col gap-2">

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

        <div className="flex gap-2">
          <p className="extra-bold">
            Lokation:
          </p>

          <p>
            {availibleWashHall} - {userLocationObj?.location_city ?? userLocation}
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