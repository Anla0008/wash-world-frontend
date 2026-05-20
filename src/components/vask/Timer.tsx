"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { TimerProps } from "@/types/wash";

const Timer = ({ totalTime, onComplete }: TimerProps) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setCurrentTime(0);
  }, [totalTime]);

  useEffect(() => {
    if (totalTime <= 0) {
      setCurrentTime(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalTime) {
          onComplete?.();
          return prev;
        }

        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTime, onComplete]);

  const resolvedProgress =
    totalTime > 0
      ? Math.min((currentTime / totalTime) * 100, 100)
      : 0;

  const resolvedFormattedTime = useMemo(() => {
    const remainingTime = Math.max(totalTime - currentTime, 0);

    const minutes = Math.floor(remainingTime / 60);

    const seconds = remainingTime % 60;

    return `${String(minutes).padStart(2, "0")}.${String(
      seconds
    ).padStart(2, "0")}`;
  }, [currentTime, totalTime]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative p-10 rounded-full border-5 border-(--gray-80) flex items-center justify-center">
        <motion.div
          className="absolute -inset-1 rounded-full"
          animate={{
            background: `conic-gradient(
              #06C167 ${resolvedProgress}%,
              transparent ${resolvedProgress}%
            )`,
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
          style={{
            maskImage:
              "radial-gradient(transparent 68%, black 69%)",
            WebkitMaskImage:
              "radial-gradient(transparent 68%, black 69%)",
          }}
        />

        <div className="relative h-46 w-46 bg-(--brand-green) rounded-full flex items-center justify-center">
          <div
            className="relative w-46 h-46 rounded-full animate-pulse"
            style={{
              boxShadow:
                "0 0 14px #06C167, 0 0 60px #06C16788, inset 0 0 14px #06C16722, inset 20px 20px 50px #00170B, inset 20px 20px 30px rgba(255,255,255,0.25)",
            }}
          >
            <h2 className="extra-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {resolvedFormattedTime}
            </h2>

            <p className="absolute top-35 left-1/2 -translate-x-1/2 -translate-y-2/2">
              Tilbage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;