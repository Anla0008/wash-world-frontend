"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { on } from "events";

type PrimaryButtonProps = {
    children: ReactNode;
    onClick?: () => void;
};

const PrimaryButton = ({ children, onClick }: PrimaryButtonProps) => {
    const [isActive, setIsActive] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);


    return (
        <div className="relative m-auto">
        <button
            className={`bg-(--brand-green) relative px-5 pr-10 py-2 w-fit extra-bold ${isDisabled ? "cursor-not-allowed bg-(--gray-80) text-(--gray-60)" : ""}`}
            disabled={isDisabled}
            onClick={() => { setIsActive((prev) => !prev); onClick?.(); }}
            style={{
                clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
                boxShadow: "inset -20px -20px 30px #00170B, inset 20px 20px 30px rgba(255, 255, 255, 0.25)"
            }}
        >
            {children}
        </button>
        <motion.div
            className="bg-foreground px-7 py-0.5 w-fit -z-10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isActive ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
        />
        </div>
    );
};
 
export default PrimaryButton;