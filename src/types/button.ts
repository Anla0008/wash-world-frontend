import { ReactNode } from "react";

export type ButtonProps = {
  children: ReactNode;
  isActive?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  disabled?: boolean;
};

export type SwipeProps = {
  children: ReactNode;
  onComplete?: () => void;
  disabled?: boolean;
};

export type AnchorButtonProps = {
  children: ReactNode;
  href: string;
  target?: string;
};

export type DeleteButtonProps = {
  user_pk: string;
  onDeleted?: () => void;
};
