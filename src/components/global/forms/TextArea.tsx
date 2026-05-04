"use client";
import Validated from "../icons/Validated";
import Error from "../icons/Error";
import { useState } from "react";
import type { ReactNode } from "react";

type TextAreaProps = {
    label: ReactNode;
    error?: boolean;
    validated?: boolean;
    placeholder: string;
};

const TextArea = ({ label, error, validated, placeholder }: TextAreaProps) => {
    // TODO: opdater denne senere til regex fra backend
    const maxLength = 200;

    const [charCount, setCharCount] = useState(0);

    return ( 
        <div className="relative w-screen px-15 mt-10">

            <textarea
                className="border-3 border-foreground w-full py-2 px-6 min-h-25"
                placeholder={placeholder}
                onChange={(e) => setCharCount(e.target.value.length)}
            />

            <div className="flex justify-between items-start px-7">
                <p className={`${error || charCount > maxLength ? "text-(--error-red)" : validated ? "text-(--brand-green)" : ""} light`}>{charCount > maxLength ? `Message must include no more than ${maxLength} characters` : ""}</p>
                <span className={`text-xs shrink-0 ml-4 ${charCount > maxLength ? "text-(--error-red)" : charCount > 0 ? "text-(--brand-green)" : "text-slate-500"}`}>{charCount}/{maxLength}</span>
            </div>

                        {/* // styling for at give input 60 graders snit */}
            <div
                className="absolute bg-background -top-3 left-18 w-fit px-4"
                style={{
                    clipPath: "polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
                }}
                > 
                
            <p className="light">{label}</p>
        </div>
                {/* #TODO: gør så error og validated først kommer frem hvis charArt er over 0 - dette tages fra backenden */}
        <div className="absolute top-2.5 right-18">
            {validated && charCount <= maxLength ? (<Validated />) : null}
            {error || charCount > maxLength ? (<Error/>) : null}
        </div>

    </div>
    );
}
 
export default TextArea;