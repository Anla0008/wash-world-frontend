"use client";

import { motion } from "framer-motion";
import Card from "../icons/grafik/Card";
import Wash from "../icons/navbar/Wash";
import Checkmark from "../icons/grafik/Checkmark";
import { ProgressBarProps } from "@/types/progressbar";
import { resolveProgressSteps } from "@/lib/wash/resolvers";

const ProgressBar = ({ activeIndex, isWashProcess, progress }: ProgressBarProps) => {
  const numbers = ["1", "2", "3"]; //TODO: skal opdateres til at bruge dataen fra backenden


  const clampedProgress = isWashProcess ? resolveProgressSteps(numbers, activeIndex, progress) : 0;


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

        {/* Animeret progress-linje */}
        <motion.div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-(--brand-green)"
          initial={false}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />

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
                <div
                  className={`h-10.5 w-10.5 border-2 border-foreground rounded-full ${backgroundClass}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ProgressBar;
