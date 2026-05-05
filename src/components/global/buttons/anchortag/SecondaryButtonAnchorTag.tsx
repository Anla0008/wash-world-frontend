"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { on } from "events";
import SecondaryButton from "../onClick/SecondaryButton";

type SecondaryButtonAnchorTagProps = {
    children: ReactNode;
    href: string;
};

const SecondaryButtonAnchorTag = ({ children, href }: SecondaryButtonAnchorTagProps) => {
    const [isDisabled, setIsDisabled] = useState(false);


    return (
        <a href={href}
            className={`bg-(--gray-60) relative m-auto px-5 pr-10 py-2 w-fit extra-bold ${isDisabled ? "cursor-not-allowed bg-(--gray-80) text-(--gray-60)" : ""}`}
            
            style={{
                clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
                boxShadow: "inset -15px -15px 20px #00170B, inset 20px 20px 30px rgba(255, 255, 255, 0.25)"
            }}
        >
            {children}
        </a>
    );
};
 
export default SecondaryButtonAnchorTag;