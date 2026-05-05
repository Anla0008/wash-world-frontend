"use client";
import { useEffect, useRef, useState } from "react";
import Filter from "../icons/navigation/Filter";
import FilterCard from "./FilterCard";

const FilterWrapper = () => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        // lukker filter kun når brugeren klikker udenfor, ikke når de klikker inde i filteret
        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node | null;
            // hvis der ikke er et target eller containerRef, returneres der tidligt
            if (!target || !containerRef.current) return;
            // tjekker om det klikkede element er udenfor filteret
            if (!containerRef.current.contains(target)) {
                setIsOpen(false);
            }
        };
        // tilføjer event listeners til at lytte efter klik
        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };

    }, [isOpen]); // useEffect afhænger af isOpen, så den kører hver gang isOpen ændres
    
    const [chosen, setChosen] = useState<string[]>([]);
    const hasFiltered = chosen.length > 0;

    const toggleOption = (option: string) => {
        setChosen((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    return (
        <div ref={containerRef} className="relative flex flex-col m-auto gap-2">
            <div className="flex items-center gap-2 cursor-pointer m-auto" onClick={() => setIsOpen(true)}>
                <Filter />
                <span>Filtrér</span>
                {hasFiltered ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // forhindrer at klik på "Nulstil" også åbner filteret
                            setChosen([]);
                        }}
                        className="text-xs extra-bold"
                    >
                        Nulstil
                    </button>
                ) : null}
            </div>

            {isOpen ? <FilterCard chosen={chosen} onToggle={toggleOption} setIsOpen={setIsOpen} /> : null}
        </div>
      );
}
 
export default FilterWrapper;