"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Popup from "../../cards/PopUp";
import { DeleteButtonProps } from "@/types/button";

export default function DeleteUserButton({ user_pk, onDeleted }: DeleteButtonProps) {
  const { deleteUser } = useAuth();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* Åbner popup i stedet for at slette direkte */}
      <button onClick={() => setShowPopup(true)} className="bg-(--error-red-transparent) pt-1 pb-1 pr-6 pl-6 rounded-4xl">
        Slet konto
      </button>

      {/* Bekræftelsespopup — vises når brugeren klikker "Slet konto" */}
      {showPopup && (
        <Popup title="Vil du slette din konto?" message="Denne handling kan ikke fortrydes!" onClose={() => setShowPopup(false)}>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setShowPopup(false)}>Annuller</button>
            <button
              onClick={async () => {
                // Kalder deleteUser fra useAuth som sender DELETE request til backend
                // og sender brugeren videre via onDeleted callback
                await deleteUser(user_pk);
                onDeleted?.();
              }}
              className="bg-(--error-red-transparent) pt-1 pb-1 pr-6 pl-6 rounded-4xl"
            >
              Ja, slet min konto
            </button>
          </div>
        </Popup>
      )}
    </>
  );
}
