"use client";

import Cross from "../icons/navigation/Cross";
import { ReactNode } from "react";

type PopupProps = {
  title: string;
  message?: string;
  subtitle?: string;
  submessage?: string;
  icon?: ReactNode; // ← kan modtage <CheckIcon />, <img />, eller hvad som helst
  onClose?: () => void;
};

const Popup = ({ title, message, subtitle, submessage, icon, onClose }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-1 bg-(--background-transparent) backdrop-blur-xs">
      {onClose && <div className="absolute inset-0" onClick={onClose} />}

      <div className="bg-(--gray-10) p-8 text-center z-10 text-(--foreground-reverse) rounded-md shadow-md">
        {onClose && (
          <button onClick={onClose} className="flex ml-auto">
            <Cross size={25} color="--foreground-reverse" />
          </button>
        )}
        {icon && <div className="flex justify-center">{icon}</div>}
        <h2 className="extra-bold">{title}</h2>
        {subtitle && <h3 className="pb-4">{subtitle}</h3>}
        {message && <p>{message}</p>}
        {submessage && <p>{submessage}</p>}
      </div>
    </div>
  );
};

export default Popup;
