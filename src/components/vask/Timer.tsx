"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TimerProps } from "@/types/timer";

const Timer = ({ totalTime }: TimerProps) => {
  // simuleret nuværende tid
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        // reset når den rammer slutningen
        if (prev >= totalTime) {
          return 0;
        }

        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // progress i procent
  const progress = (currentTime / totalTime) * 100;

  // formatter tid til mm:ss
  const minutes = Math.floor((totalTime - currentTime) / 60);
  const seconds = (totalTime - currentTime) % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}.${String(
    seconds,
  ).padStart(2, "0")}`;

  return (
    <div className="relative flex items-center justify-center">
      {/* Grå cirkel */}
      <div className="relative p-10 rounded-full border-5 border-(--gray-80) flex items-center justify-center">
        {/* Grøn progress-ring */}
        <motion.div
          className="absolute -inset-1 rounded-full"
          animate={{
            background: `conic-gradient(
                            #06C167 ${progress}%,
                            transparent ${progress}%
                        )`,
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
          style={{
            maskImage: "radial-gradient(transparent 68%, black 69%)",
            WebkitMaskImage: "radial-gradient(transparent 68%, black 69%)",
          }}
        />

        {/* Indre grøn cirkel */}
        <div className="relative h-46 w-46 bg-(--brand-green) rounded-full flex items-center justify-center">
          {/* Glow / puls */}
          <div
            className="relative w-46 h-46 rounded-full animate-pulse"
            style={{
              boxShadow:
                "0 0 14px #06C167, 0 0 60px #06C16788, inset 0 0 14px #06C16722, inset 20px 20px 50px #00170B, inset 20px 20px 30px rgba(255,255,255,0.25)",
            }}
          >
            <h2 className="extra-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {formattedTime}
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
