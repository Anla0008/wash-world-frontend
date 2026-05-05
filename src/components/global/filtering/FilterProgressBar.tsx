"use client";

import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const FilterProgressBar = () => {
    // Dynamiske steps
    const numbers = [1, 2, 3, 4, 5];

    const minStep = numbers[0];
    const maxStep = numbers[numbers.length - 1];

    // Starter altid på højeste værdi
    const [activeStep, setActiveStep] = useState<number>(maxStep);

    // Progress omkonverteret til procent
    const progressPercent = useMemo(() => {
        return (
            ((activeStep - minStep) / (maxStep - minStep)) * 100
        );
    }, [activeStep, minStep, maxStep]);

    return (
        <div className="w-full m-auto max-w-xl px-4 py-10">
            <Slider.Root
                value={[activeStep]}
                min={minStep}
                max={maxStep}
                step={1}
                onValueChange={(value) => {
                    setActiveStep(value[0]);
                }}
                className="relative px-1.5 flex w-full touch-none select-none items-center"
            >
                {/* Track */}
                <Slider.Track className="relative h-1.5 w-full rounded-full bg-white/20">
                    
                    {/* Animated progress */}
                    <motion.div
                        className="absolute left-0 top-0 h-full rounded-full bg-white"
                        animate={{
                            width: `${progressPercent}%`,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 140,
                            damping: 20,
                        }}
                    />

                    {/* Step circles */}
                    {numbers.map((number, index) => {
                        const position =
                            (index / (numbers.length - 1)) * 100;

                        const isActive = number <= activeStep;
                        const isCurrent = number === activeStep;

                        return (
                            <button
                                key={number}
                                type="button"
                                onClick={() => setActiveStep(number)}
                                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    left: `${position}%`,
                                }}
                            >
                                <motion.div
                                    animate={{
                                        scale: isCurrent ? 1.15 : 1,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                    }}
                                    className={`
                                        flex h-14 w-14 items-center justify-center rounded-full
                                        text-2xl font-bold transition-colors duration-300
                                        ${
                                            isCurrent
                                                ? "bg-(--brand-green) text-foreground"
                                                : "bg-foreground"
                                        }
                                    `}
                                >
                                    {number}
                                </motion.div>
                            </button>
                        );
                    })}
                <div className="flex justify-between">
                    <h3>{minStep}</h3>
                    <h3>{maxStep}</h3>
                </div>
                </Slider.Track>

                {/* Hidden thumb (required by Radix) */}
                <Slider.Thumb className="h-0 w-0 opacity-0" />
            </Slider.Root>

            <div className="py-10 flex justify-between m-auto">
                <h3>{minStep}</h3>
                <h3>{maxStep}</h3>
            </div>
        </div>
    );
};

export default FilterProgressBar;