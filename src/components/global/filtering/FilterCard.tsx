"use client";
import OpenAndClose from "../icons/navigation/OpenAndClose";
import FilterButton from "../buttons/onClick/FilterButton";
import FilterProgressBar from "./FilterProgressBar";
import { FilterCardProps } from "@/types/filtering";

const FilterCard = ({
  chosen,
  onToggle,
  setIsOpen,

  washHallRange,
  setWashHallRange,
  washHallNumbers,

  selfWashRange,
  setSelfWashRange,
  selfWashNumbers,
}: FilterCardProps) => {
  // opdateres til at bruge dataen fra backenden m. singleviews indhold
  const options = ["Højtryksforvask", "Støvsuger", "Vask selv"];

  return (
    <div className="hide-scrollbar flex max-h-[50dvh] min-h-0 w-full flex-col gap-10 overflow-y-auto bg-background p-10" onClick={(e) => e.stopPropagation()}>
      {" "}
      <div
        className="absolute top-5 right-5 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
      >
        <OpenAndClose isOpen={true} size={30} />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center">
          <p className="extra-bold">Vis kun vaskehaller med</p>
          <span>({chosen.length})</span>
        </div>

        <div className="flex gap-5 flex-wrap">
          {options.map((option) => (
            <FilterButton key={option} isActive={chosen.includes(option)} onToggle={() => onToggle(option)}>
              {option}
            </FilterButton>
          ))}
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-5">
          <p className="extra-bold">Antal vaskehaller</p>
          <FilterProgressBar numbers={washHallNumbers} initialMinStep={washHallRange.min} initialMaxStep={washHallRange.max} onRangeChange={setWashHallRange} />{" "}
        </div>

        <div className="flex flex-col gap-5">
          <p className="extra-bold">Antal vask selv</p>
          <FilterProgressBar numbers={selfWashNumbers} initialMinStep={selfWashRange.min} initialMaxStep={selfWashRange.max} onRangeChange={setSelfWashRange} />{" "}
        </div>
      </div>
    </div>
  );
};

export default FilterCard;
