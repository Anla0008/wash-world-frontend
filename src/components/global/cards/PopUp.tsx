"use client";

import Cross from "../icons/navigation/Cross";

// Flytte til types-mappe
type PopupProps = {
  title: string;
  message?: string;
  subtitle?: string;
  submessage?: string;
  onClose?: () => void;
};

const Popup = ({ title, message, subtitle, submessage, onClose }: PopupProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-1">
      <div className="bg-(--gray-10) p-8 text-center z-50 text-(--foreground-reverse) rounded-md shadow-md">
        <Cross size={25} color="--foreground-reverse"></Cross>
        <h2 className="extra-bold -mt-4">{title}</h2>
        {subtitle && <h3 className="pb-4">{subtitle}</h3>}
        {message && <p>{message}</p>}
        {submessage && <p>{submessage}</p>}
        {onClose && (
          <button onClick={onClose} className="mt-6">
            Luk
          </button>
        )}
      </div>
    </div>
  );
};

export default Popup;
