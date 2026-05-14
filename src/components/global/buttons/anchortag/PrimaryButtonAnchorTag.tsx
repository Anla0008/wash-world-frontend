"use client";
import { useState } from "react";
import { AnchorButtonProps } from "@/types/button";

const PrimaryButtonAnchorTag = ({
  children,
  href,
  target,
}: AnchorButtonProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <a
      href={href}
      target={target}
      className={`bg-(--brand-green) relative inline-flex px-5 pr-10 py-2 w-fit extra-bold ${isDisabled ? "cursor-not-allowed bg-(--gray-80) text-(--gray-60)" : ""}`}
      style={{
        clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
        boxShadow:
          "inset -20px -20px 30px #00170B, inset 20px 20px 30px rgba(255, 255, 255, 0.25)",
      }}
    >
      {children}
    </a>
  );
};

export default PrimaryButtonAnchorTag;
