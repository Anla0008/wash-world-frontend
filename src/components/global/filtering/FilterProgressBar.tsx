"use client";

import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { FilterProgressBarProps } from "@/types/filtering";

const FilterProgressBar = ({ numbers = [1], initialMinStep, initialMaxStep, onRangeChange }: FilterProgressBarProps) => {
  const sortedNumbers = useMemo(() => [...numbers].sort((a, b) => a - b), [numbers]); // sorterer tallene i stigende rækkefølge - fallback

  const minStep = sortedNumbers[0];
  const maxStep = sortedNumbers[sortedNumbers.length - 1];

  // sikrer af minStep ikke er højere end maxStep og omvendt, og at de begge er inden for det tilladte interval
  const initialRange = useMemo<[number, number]>(() => {
    const startMin = Math.min(Math.max(initialMinStep ?? minStep, minStep), maxStep);
    const startMax = Math.min(Math.max(initialMaxStep ?? maxStep, minStep), maxStep);

    return [Math.min(startMin, startMax), Math.max(startMin, startMax)];
  }, [initialMinStep, initialMaxStep, minStep, maxStep]);

  // activeRange er den valgte rækkevidde, som opdateres, når brugeren interagerer med slideren
  const [activeRange, setActiveRange] = useState<[number, number]>(initialRange);

  useEffect(() => {
    setActiveRange(initialRange);
  }, [initialRange]);

  useEffect(() => {
    onRangeChange?.({ min: activeRange[0], max: activeRange[1] });
  }, [activeRange, onRangeChange]);

  const [activeStepMin, activeStepMax] = activeRange;

  // beregner startpositionen og bredden af det aktive område på slideren i procent, baseret på den valgte rækkevidde og det samlede interval
  const { rangeStartPercent, rangeWidthPercent } = useMemo(() => {
    if (maxStep === minStep) {
      return { rangeStartPercent: 0, rangeWidthPercent: 100 };
    }

    // konverterer en værdi til en procentdel af det samlede interval
    const toPercent = (value: number) => ((value - minStep) / (maxStep - minStep)) * 100;
    const start = toPercent(activeStepMin);
    const end = toPercent(activeStepMax);
    // returnering af startpositionen og bredden af det aktive område i procent
    return {
      rangeStartPercent: start,
      rangeWidthPercent: Math.max(end - start, 0), // sikrer at bredden ikke bliver negativ, hvis max er mindre end min
    };
  }, [activeStepMin, activeStepMax, minStep, maxStep]);

  return (
    <div className="w-full m-auto max-w-xl px-4 py-10">
      <Slider.Root
        value={activeRange}
        min={minStep}
        max={maxStep}
        step={1}
        onValueChange={(value) => {
          setActiveRange([value[0], value[1]]);
        }}
        className="relative flex w-full touch-none select-none items-center px-1.5"
      >
        <Slider.Track className="relative h-1.5 w-full rounded-full bg-foreground/20">
          <motion.div
            className="absolute top-0 h-full rounded-full bg-foreground"
            animate={{
              left: `${rangeStartPercent}%`,
              width: `${rangeWidthPercent}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 20,
            }}
          />
          {/* generer knapper ved at mappe over de sortede tal */}
          {sortedNumbers.map((number, index) => {
            const position = sortedNumbers.length === 1 ? 0 : (index / (sortedNumbers.length - 1)) * 100;

            const isActiveMin = number === activeStepMin;
            const isActiveMax = number === activeStepMax;
            const isInRange = number > activeStepMin && number < activeStepMax;

            return (
              <button
                key={number}
                type="button"
                // on mousedown så brugeren også kan slide
                onMouseDown={() => {
                  const distanceToMin = Math.abs(number - activeStepMin);
                  const distanceToMax = Math.abs(number - activeStepMax);
                  // hvis det klikkede tal er tættere på det nuværende minimum, opdateres minimum, ellers opdateres maksimum
                  if (distanceToMin <= distanceToMax) {
                    setActiveRange([Math.min(number, activeStepMax), Math.max(number, activeStepMax)]);
                    return;
                  }
                  setActiveRange([Math.min(activeStepMin, number), Math.max(activeStepMin, number)]);
                }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${position}%`,
                }}
              >
                <motion.div
                  animate={{
                    scale: isActiveMin || isActiveMax ? 1.15 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={`
                                        flex h-14 w-14 items-center justify-center rounded-full
                                        text-2xl font-bold transition-colors duration-300
                                        ${isActiveMin || isActiveMax ? "bg-(--brand-green) text-foreground" : isInRange ? "bg-foreground text-background" : "bg-foreground text-background"}
                                    `}
                >
                  {number}
                </motion.div>
              </button>
            );
          })}
        </Slider.Track>

        <Slider.Thumb className="h-0 w-0 opacity-0" aria-label="Minimum" />
        <Slider.Thumb className="h-0 w-0 opacity-0" aria-label="Maksimum" />
      </Slider.Root>

      <div className="m-auto flex justify-between py-10 light">
        <p>MIN: {activeStepMin}</p>
        <p>MAX: {activeStepMax}</p>
      </div>
    </div>
  );
};

export default FilterProgressBar;
