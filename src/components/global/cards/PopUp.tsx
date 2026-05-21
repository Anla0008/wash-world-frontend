"use client";

import Cross from "../icons/navigation/Cross";
import { PopupProps } from "@/types/popUp";

const Popup = ({ title, message, subtitle, submessage, icon, onClose, children }: PopupProps) => {
  return (
    /* Overlay som dækker hele skærmen */
    <div className="fixed inset-0 z-1 flex items-center justify-center bg-(--background-transparent) backdrop-blur-xs">
      {/* Klik udenfor popup lukker den. Lav et usynligt lag over hele skærmen, som lukker popup når man klikker udenfor */}
      {onClose && <div className="absolute inset-0" onClick={() => onClose?.()} />}

      {/* Popup container */}
      <div className="z-10 rounded-md bg-(--gray-10) p-8 text-center text-(--foreground-reverse) shadow-md">
        {/* Luk-knap */}
        {onClose && (
          <button onClick={() => onClose?.()} className="ml-auto flex">
            <Cross size={25} color="--foreground-reverse" />
          </button>
        )}

        {/* Ikon (valgfrit) */}
        {icon && <div className="flex justify-center">{icon}</div>}

        {/* Titel */}
        <h2 className="extra-bold">{title}</h2>

        {/* Undertitel (valgfrit) */}
        {subtitle && <h3 className="pb-4">{subtitle}</h3>}

        {/* Besked (valgfrit) */}
        {message && <p>{message}</p>}

        {/* Ekstra besked (valgfrit)*/}
        {submessage && <p>{submessage}</p>}

        {/* Viser children hvis de er sendt med — fx knapper */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default Popup;
