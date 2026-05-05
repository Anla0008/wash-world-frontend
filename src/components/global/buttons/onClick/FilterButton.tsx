"use client";
import { ReactNode } from "react";

type FilterButtonProps = {
    children: ReactNode;
    isActive?: boolean;
    onToggle?: () => void;
    onClick?: () => void;
};

const FilterButton = ({children, isActive = false, onToggle, onClick}: FilterButtonProps) => {

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
}
 
export default FilterButton;