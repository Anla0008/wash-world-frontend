"use client";

import Card from "../icons/grafik/Card";
import Wash from "../icons/navbar/Wash";
import Checkmark from "../icons/grafik/Checkmark";
import { ProgressBarProps } from "@/types/progressbar";
import { useWashStore } from "@/stores/useWashStore";
import { resolveDurationToMinutesSeconds } from "@/lib/wash/resolvers";

const ProgressBar = ({ activeIndex, isWashProcess }: ProgressBarProps) => {
  const numbers = ["1", "2", "3"]; //TODO: skal opdateres til at bruge dataen fra backenden

  const { selectedWash } = useWashStore();

  const { formattedDuration } = resolveDurationToMinutesSeconds(selectedWash?.duration ?? 0);
  const isFinalStep = activeIndex === numbers.length;

  return (
    <div className="max-w-100 m-auto w-full">
      {isWashProcess ? (
        <ul className="mb-2 flex px-2.5 justify-between gap-10">
          {numbers.map((number) => {
            const stepNumber = Number(number);

            return (
              <li key={`icon-${number}`} className="flex h-5 justify-center">
                {stepNumber === 1 ? (
                  <Card color="foreground" size={20} />
                ) : stepNumber === 2 ? (
                  <Wash color="foreground" size={20} />
                ) : (
                  <Checkmark color="foreground" size={20} />
                )}
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="relative">
        {/* Baggrundslinje */}
        <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-foreground/30" />

        <ul className="relative z-10 flex justify-between gap-10">
          {numbers.map((number) => {
            const stepNumber = Number(number);

            const backgroundClass =
              stepNumber < activeIndex
                ? "bg-(--brand-green)"
                : stepNumber === activeIndex
                  ? "bg-foreground"
                  : "bg-background";

            return (
              <li key={number}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`h-10.5 w-10.5 border-2 border-foreground rounded-full ${backgroundClass}`}
                  />
                  {stepNumber === 2 && isFinalStep ? (
                    <span className="text-sm">
                      {formattedDuration}
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ProgressBar;
