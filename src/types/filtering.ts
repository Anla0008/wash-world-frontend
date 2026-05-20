// filtreringskortet
// export type FilterCardProps = {
//   chosen: string[];
//   onToggle: (option: string) => void;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // React.Dispatch<React.SetStateAction = type for setState funktion i React
//   // bruges senere til at sætte range på progressbaren for antal vaskehaller og vask selv
//   washHallRange: {
//     min: number;
//     max: number;
//   };
//   // ændrer range for antal vaskehaller og vask selv i filteret, og bruges senere til at filtrere dataen fra backenden
//   setWashHallRange: React.Dispatch<
//     React.SetStateAction<{
//       min: number;
//       max: number;
//     }>
//   >;
// };

// import { SetStateAction } from "react";

// export type WashHallRange = {
//   min: number;
//   max: number;
// };

// export type FilterCardProps = {
//   chosen: string[];
//   onToggle: (option: string) => void;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   washHallRange: WashHallRange;
//   setWashHallRange: (value: SetStateAction<WashHallRange>) => void;
//   maxWashHallNumber: number;
//   washHallNumbers: number[];
// };

// // progressbar til filtrering af antal vaskehaller og vask selv
// export type FilterProgressBarProps = {
//   numbers?: number[];
//   initialMinStep?: number;
//   initialMaxStep?: number;
//   onRangeChange?: (range: Wash) => void;
// };

// // sortering efter ledighed
// export type SortDirection = "asc" | "desc";

// export type SortingProps = {
//   label?: string;
//   direction?: SortDirection;
//   defaultDirection?: SortDirection;
//   onDirectionChange?: (direction: SortDirection) => void; // callback funktion der kaldes når sorteringsretningen ændres
//   className?: string;
// };

import { SetStateAction } from "react";

export type Range = {
  min: number;
  max: number;
};

export type FilterCardProps = {
  chosen: string[];
  onToggle: (option: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

  washHallRange: Range;
  setWashHallRange: (value: SetStateAction<Range>) => void;
  washHallNumbers: number[];
  maxWashHallNumber: number;

  selfWashRange: Range;
  setSelfWashRange: (value: SetStateAction<Range>) => void;
  selfWashNumbers: number[];
  maxSelfWashNumber: number;
};

export type FilterProgressBarProps = {
  numbers?: number[];
  initialMinStep?: number;
  initialMaxStep?: number;
  onRangeChange?: (range: Range) => void;
};

export type SortDirection = "asc" | "desc";

export type SortingProps = {
  label?: string;
  direction?: SortDirection;
  defaultDirection?: SortDirection;
  onDirectionChange?: (direction: SortDirection) => void;
  className?: string;
};
