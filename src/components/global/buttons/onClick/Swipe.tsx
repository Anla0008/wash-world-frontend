"use client";

import { ReactNode, useRef } from "react";
import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import ArrowRight from "../../icons/navigation/ArrowRight";
import { useState } from "react";

type SwipeProps = {
    children: ReactNode;
    onComplete?: () => void;
    disabled?: boolean;
};

const Swipe = ({ children, onComplete, disabled }: SwipeProps) => {
    const x = useMotionValue(0);

    const knobOffset = 4;
    const knobSize = 54;
    const progressWidth = useTransform(x, (latestX) => latestX + knobOffset + knobSize);

    const [isDragging, setIsDragging] = useState(false);

    const constraintsRef = useRef<HTMLDivElement>(null);

    const handleDragEnd = () => {
        const currentX = x.get();

        // Hvor langt den skal trækkes før success
        if (currentX > 180) {
            animate(x, 220, {
                type: "spring",
                stiffness: 300,
                damping: 30,
            });

            onComplete?.();
        } else {
            // snap tilbage
            animate(x, 0, {
                type: "spring",
                stiffness: 300,
                damping: 20,
            });
        }
    };

   return (
    <div
        ref={constraintsRef}
        className={`relative m-auto w-70 h-15.5 rounded-full bg-(--brand-green) overflow-hidden ${disabled ? "opacity-50 bg-(--gray-80) pointer-events-none" : ""}`}
        style={{  
            boxShadow:
                "inset -20px -20px 30px #00170B, inset 20px 20px 30px rgba(255, 255, 255, 0.25)",
        }}
    >
        {/* Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <h3 className="extra-bold text-foreground">{children}</h3>
        </div>

        {isDragging ? (
            <motion.div
                style={{
                    width: progressWidth,
                }}
                className="absolute left-0 top-0 bottom-0 rounded-full bg-(--gray-80)/75 pointer-events-none z-5"
            />
        ) : null}

        {/* Swipe knob */}
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 220 }}
            dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
                setIsDragging(false);
                handleDragEnd();
            }}
            style={{ x }}
            className="absolute left-1 top-1 w-13.5 h-13.5 rounded-full bg-foreground flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        >
            <ArrowRight color={"black"} size={25} />
        </motion.div>
    </div>
    );
};

export default Swipe;