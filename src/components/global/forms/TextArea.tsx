"use client";
import Validated from "../icons/Validated";
import Error from "../icons/Error";
import { useState } from "react";

const TextArea = ({ label, helper, error, validated, placeholder }) => {
    const maxLength = 200;
    const minLength = 10;

    const [charCount, setCharCount] = useState(0);
    return ( 
        <div className="relative w-screen px-15 mt-10">

            <textarea
                className="border-3 border-foreground w-full py-2 px-6 min-h-25"
                placeholder={placeholder}
                onChange={(e) => setCharCount(e.target.value.length)}
            />

            <div className="flex justify-between items-start px-7">
                <p className={`${error || charCount < minLength || charCount > maxLength ? "text-(--error-red)" : validated && charCount >= minLength && charCount <= maxLength ? "text-(--brand-green)" : ""} light`}>{charCount < minLength ? `Message must include between ${minLength} and ${maxLength} characters` : helper}</p>
                <span className={`text-xs shrink-0 ml-4 ${charCount < minLength || charCount > maxLength ? "text-(--error-red)" : "text-(--brand-green)"}`}>{charCount}/{maxLength}</span>
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

        <div className="absolute top-2.5 right-18">
            {validated && charCount >= minLength && charCount <= maxLength ? (<Validated />) : null}
            {error || charCount < minLength || charCount > maxLength ? (<Error/>) : null}
        </div>

    </div>
    );
}
 
export default TextArea;