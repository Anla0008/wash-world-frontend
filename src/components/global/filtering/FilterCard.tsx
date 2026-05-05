"use client";
import OpenAndClose from "../icons/navigation/OpenAndClose";
import FilterButton from "../buttons/onClick/FilterButton";

const FilterCard = ({ chosen, onToggle, setIsOpen }: { chosen: string[]; onToggle: (option: string) => void; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

    // opdateres til at bruge dataen fra backenden m. singleviews indhold
    const options = [
        "Højtryksforvask",
        "Støvsuger",
        "Vask selv",
    ];

    return ( 
        <div className="bg-background flex flex-col gap-10 p-10" onClick={(e) => e.stopPropagation()}>

                <div
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                >
                    <OpenAndClose size={30}/>
                </div>

            <div className="flex flex-col gap-5">
                <div className="flex gap-2 items-center">
                    <p className="extra-bold">Vis kun vaskehaller med</p>
                    <span>({chosen.length})</span>
                </div>

                <div className="flex gap-5 flex-wrap">
                    {options.map((option) => (
                        <FilterButton
                            key={option}
                            isActive={chosen.includes(option)}
                            onToggle={() => onToggle(option)}
                        >
                            {option}
                        </FilterButton>
                    ))}
                </div>

            </div>

                <div className="flex flex-col gap-5">
                    <p className="extra-bold">Antal vaskehaller</p>
                    {/* // TODO: indsæt komponent */}
                </div>

                    <div className="flex flex-col gap-5">
                    <p className="extra-bold">Antal vask selv</p>
                    {/* TODO: indsæt komponent */}
                </div>

        </div>
     );
}
 
export default FilterCard;