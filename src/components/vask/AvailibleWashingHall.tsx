"use client";
import { useState } from "react";
import { generateAvailibleWashHalls } from "@/lib/wash/resolvers";

const AvailibleWashingHall = () => {
    const [availableWashHall] = useState(() => generateAvailibleWashHalls()); //useState så randomIndex ikke ændres hele tiden

    return ( 
            <div className="flex flex-col items-center justify-center">
                <h4>Næste ledige vaskehal:</h4>
                <h2 className="extra-bold">Vaskehal {availableWashHall}</h2>
            </div>
     );
}
 
export default AvailibleWashingHall;