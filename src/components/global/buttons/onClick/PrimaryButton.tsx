"use client";
import { motion } from "framer-motion";
import { ButtonProps } from "@/types/button";

const PrimaryButton = ({ children, onClick, isActive = false, disabled = false }: ButtonProps) => {
  return (
    <div className="relative m-auto">
      <button
        type="submit"
        className={`bg-(--brand-green) relative px-5 pr-10 py-2 w-fit extra-bold text-white ${disabled ? "cursor-not-allowed bg-(--gray-80) text-(--gray-60)" : ""}`}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          onClick?.();
        }}
        style={{
          clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
          boxShadow: disabled ? "none" : "inset -20px -20px 30px #00170B, inset 20px 20px 30px rgba(255, 255, 255, 0.25)",
        }}
      >
        {children}
      </button>
      <motion.div className="bg-(--brand-green) px-7 py-0.5 w-fit -z-10" initial={{ scaleY: 0 }} animate={{ scaleY: isActive && !disabled ? 1 : 0 }} transition={{ duration: 0.4, ease: "easeOut" }} style={{ transformOrigin: "top" }} />
    </div>
  );
};

export default PrimaryButton;
