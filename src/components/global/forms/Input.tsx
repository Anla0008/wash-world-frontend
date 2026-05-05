import Validated from "../icons/validation/Validated";
import Error from "../icons/validation/Error";

import { useState, type ReactNode } from "react";

type InputProps = {
    label: ReactNode;
    error?: boolean;
    validated?: boolean;
    placeholder: string;
    type: string;
};
const Input = ({ label, error, validated, type, placeholder }:InputProps) => {
  const [charCount, setCharCount] = useState(0);
  
    return ( 
        <div className="relative w-screen px-15 mt-10">

            <input className={`border-3 border-foreground w-full py-2 px-6 ${error ? "border-(--error-red)" : validated ? "border-(--brand-green)" : ""}`} type={type} placeholder={placeholder} onChange={(e) => setCharCount(e.target.value.length)} />

            <p className={`${error ? "text-(--error-red)" : validated ? "text-(--brand-green)" : ""} px-7 light`}></p>

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
            {validated ? (<Validated />) : null}
            {error ? (<Error/>) : null}
        </div>

    </div>
    );
}
 
export default Input;