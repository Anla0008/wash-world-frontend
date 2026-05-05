"use client";
import Card from "../icons/grafik/Card";
import Wash from "../icons/navbar/Wash";
import Checkmark from "../icons/grafik/Checkmark";

type ProgressBarProps = {
    activeIndex?: number | null;
    isWashProcess?: boolean;
}
    
const ProgressBar = ({activeIndex, isWashProcess}: ProgressBarProps) => {
    // TODO: gør denne dynamisk fra komponent til komponent 
    const numbers = [
        "1",
        "2",
        "3",
    ]
    
    return (
        <div className="max-w-100 m-auto w-full">
            {/* tilføjer ikoner over progressbaren hvis det er en vaskeproces */}
            {isWashProcess ? (
                <ul className="mb-2 flex px-2.5 justify-between gap-10">
                    {numbers.map((number) => {
                        const stepNumber = Number(number);

                        return (
                            <li key={`icon-${number}`} className="flex h-5 justify-center">
                                {stepNumber < (activeIndex ?? 0) ? <Card color="foreground" size={20} /> : stepNumber === activeIndex ? <Wash color="foreground" size={20} /> : <Checkmark color="foreground" size={20} />}
                            </li>
                        );
                    })}
                </ul>
            ) : null}

            <div className="relative">
                <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-foreground"></div>

                <ul className="relative z-10 flex justify-between gap-10">
                    {numbers.map((number) => {

                        // til at definere nummerets baggrundsfarve afhængigt af activeIndex
                        const stepNumber = Number(number);

                        const backgroundClass =

                            // hvis stepNumber er mindre end activeIndex, er det fuldført og får brand-green som baggrindsfarve
                            stepNumber < (activeIndex ?? 0) ? "bg-(--brand-green)"

                            // hvis stepNumber er lig med activeIndex, er det det aktive step og får foreground som baggrundsfarve
                            : stepNumber === activeIndex ? "bg-foreground"

                            // hvis stepNumber er større end activeIndex, er det et inaktivt step og får background som baggrundsfarve
                            : "bg-background";

                        return (
                            <li key={number}>
                                <button className={`h-10.5 w-10.5 border-2 border-foreground rounded-full ${backgroundClass}`}></button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
 
export default ProgressBar;