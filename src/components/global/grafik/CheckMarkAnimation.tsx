"use client";

import { motion } from "framer-motion";
import { CheckMarkAnimationProps } from "@/types/progressbar";
import { useEffect } from "react";

const CheckMarkAnimation = ({
title,
subtitle,
onComplete,
durationMs = 1600,
}: CheckMarkAnimationProps) => {
    useEffect(() => {
        if (!onComplete) return;

        const timer = window.setTimeout(() => {
            onComplete();
        }, durationMs);

        return () => window.clearTimeout(timer);
    }, [onComplete, durationMs]);

    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <motion.div
                className="relative h-24 w-24"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-(--brand-green)/25"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.8, 1.15, 1], opacity: [0, 0.7, 0.3] }}
                    transition={{ duration: 1.2, times: [0, 0.6, 1], ease: "easeInOut" }}
                />

                <motion.svg
                    viewBox="0 0 80 80"
                    className="absolute inset-0 h-full w-full"
                    aria-hidden="true"
                >
                    <motion.circle
                        cx="40"
                        cy="40"
                        r="34"
                        fill="none"
                        stroke="var(--brand-green)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.9, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M24 41 L35 52 L57 29"
                        fill="none"
                        stroke="var(--brand-green)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.75, delay: 0.55, ease: "easeInOut" }}
                    />
                </motion.svg>
            </motion.div>

            <div className="flex flex-col">
                <h3 className="extra-bold">{title}</h3>
                <p className="text-sm text-(--gray-20)">{subtitle}</p>
            </div>
        </div>
    );
};

export default CheckMarkAnimation;