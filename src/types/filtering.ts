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
