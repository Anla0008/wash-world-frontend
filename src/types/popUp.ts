import { ReactNode } from "react";

export type PopupProps = {
  title: string;
  message?: string;
  subtitle?: string;
  submessage?: string;
  icon?: ReactNode; // ← kan modtage <CheckIcon />, <img />, eller hvad som helst
  onClose?: () => void;
  children?: React.ReactNode;
};
