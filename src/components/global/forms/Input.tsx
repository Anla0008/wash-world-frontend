import Validated from "../icons/validation/Validated";
import Error from "../icons/validation/Error";
import { FormProps } from "@/types/forms";
import { useState } from "react";

const Input = ({ label, error, validated, type, placeholder, value, onChange, disabled, errorMessage, labelBg }: FormProps) => {
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="relative w-full">
      <input
        className={`border-3 border-foreground w-full py-2 px-2 ${error ? "border-(--error-red)" : validated ? "border-(--brand-green)" : ""}`}
        type={type}
        placeholder={placeholder}
        onChange={(e) => {
          setCharCount(e.target.value.length);
          onChange?.(e);
        }}
        disabled={disabled}
        value={value}
      />

      <p className={`${error ? "text-(--error-red)" : validated ? "text-(--brand-green)" : ""} light`}>{error && errorMessage}</p>

      {/* Styling for at give input 60 graders snit */}
      <div
        className="absolute -top-3 w-fit px-4"
        style={{
          clipPath: "polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
          backgroundColor: labelBg ?? "var(--background)",
        }}
      >
        <p className="light">{label}</p>
      </div>
      {/* Gør så error og validated først kommer frem hvis charArt er over 0 - dette tages fra backenden */}
      <div className="absolute top-2.5 right-3">{error ? <Error /> : validated ? <Validated /> : null}</div>
    </div>
  );
};

export default Input;
