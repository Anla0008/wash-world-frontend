"use client";
import { ButtonProps } from "@/types/button";

const FilterButton = ({
  children,
  isActive = false,
  onToggle,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`border border-foreground px-5 py-2 ${isActive ? "bg-foreground text-background" : ""}`}
      onClick={() => {
        if (onToggle) onToggle();
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export default FilterButton;
