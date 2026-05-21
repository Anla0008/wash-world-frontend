export type ProgressBarProps = {
  activeIndex: number;
  isWashProcess?: boolean;
  totalTime?: number;
  progress?: number;
};

export type CheckMarkAnimationProps = {
    title?: string;
    subtitle?: string;
  onComplete?: () => void;
  durationMs?: number;
};