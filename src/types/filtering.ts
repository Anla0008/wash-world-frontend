// filtreringskortet
export type FilterCardProps = {
  chosen: string[];
  onToggle: (option: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; // React.Dispatch<React.SetStateAction = type for setState funktion i React
  // bruges senere til at sætte range på progressbaren for antal vaskehaller og vask selv
  washHallRange: {
    min: number;
    max: number;
  };
  // ændrer range for antal vaskehaller og vask selv i filteret, og bruges senere til at filtrere dataen fra backenden
  setWashHallRange: React.Dispatch<
    React.SetStateAction<{
      min: number;
      max: number;
    }>
  >;
};

// progressbar til filtrering af antal vaskehaller og vask selv
export type FilterProgressBarProps = {
  numbers?: number[];
  initialMinStep?: number;
  initialMaxStep?: number;
  onRangeChange?: (range: { min: number; max: number }) => void;
};

// sortering efter ledighed
export type SortDirection = "asc" | "desc";

export type SortingProps = {
  label?: string;
  direction?: SortDirection;
  defaultDirection?: SortDirection;
  onDirectionChange?: (direction: SortDirection) => void; // callback funktion der kaldes når sorteringsretningen ændres
  className?: string;
};
