export type FilterCardProps = {
    chosen: string[];
    onToggle: (option: string) => void;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;

    washHallRange: {
        min: number;
        max: number;
    };

    setWashHallRange: React.Dispatch<
        React.SetStateAction<{
            min: number;
            max: number;
        }>
    >;
};

export type FilterProgressBarProps = {
    numbers?: number[];
    initialMinStep?: number;
    initialMaxStep?: number;
    onRangeChange?: (range: { min: number; max: number }) => void;
};

export type SortDirection = "asc" | "desc";

export type SortingProps = {
    label?: string;
    direction?: SortDirection;
    defaultDirection?: SortDirection;
    onDirectionChange?: (direction: SortDirection) => void;
    className?: string;
};