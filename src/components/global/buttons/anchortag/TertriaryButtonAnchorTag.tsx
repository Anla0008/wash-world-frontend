"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { on } from "events";

type TertiaryButtonAnchorTagProps = {
    children: ReactNode;
    href: string;
};

const TertiaryButtonAnchorTag = ({ children, href }: TertiaryButtonAnchorTagProps) => {
    const [isActive, setIsActive] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);


    return (
        <a href={href}
            className={`bg-foreground text-background relative px-5 pr-10 py-2 w-fit extra-bold ${isDisabled ? "cursor-not-allowed bg-(--gray-80) text-(--gray-60)" : ""}`}
            style={{
                clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
                boxShadow: "inset -10px -10px 20px #121212, inset 20px 20px 30px rgba(255, 255, 255, 0.25)"
            }}
        >
            {children}
        </a>
    );
};
 
export default TertiaryButtonAnchorTag;