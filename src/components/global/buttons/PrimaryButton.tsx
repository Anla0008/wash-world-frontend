import type { ReactNode } from "react";

type PrimaryButtonProps = {
    children: ReactNode;
};

const PrimaryButton = ({ children }: PrimaryButtonProps) => {
    return (
        <button
            className="bg-(--brand-green) px-5 pr-10 py-2 w-fit m-auto extra-bold"
            style={{
                clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
                boxShadow: "inset -20px -20px 30px #00170B, inset 20px 20px 30px rgba(255, 255, 255, 0.25)"
    
            }}
        >
            {children}
        </button>
    );
};
 
export default PrimaryButton;