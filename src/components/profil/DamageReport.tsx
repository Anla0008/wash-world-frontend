"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDamageReport } from "@/hooks/useDamageReport";
import TextArea from "@/components/global/forms/TextArea";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import Popup from "@/components/global/cards/PopUp";
import Checkmark from "@/components/global/icons/grafik/Checkmark";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import Link from "next/link";

export default function DamageReport() {
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // Styrer success popup

  const { sendDamageReport } = useDamageReport();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Extract description from the form
    const form = new FormData(e.currentTarget);
    const description = form.get("description");

    // Validation fejl
    if (!description || !(description as string).trim()) {
      setError("Du skal beskrive din skade.");
      return;
    }

    setError(""); // Ryd gammel fejl

    // Henter brugerens email fra localStorage, som blev gemt ved login
    const userEmail = localStorage.getItem("user_email") || "";

    try {
      await sendDamageReport(description as string, userEmail);
      setShowSuccess(true);
      setTimeout(() => router.push("/dashboard"), 5000);
    } catch {
      setError("Der opstod en fejl. Prøv igen senere.");
    }
  };

  return (
    <div>
         <Link href="/profil" className="flex items-center gap-2 mb-4">
            <ArrowLeft size={24} />
              Profil
            </Link>
            
      <h1 className="extra-bold pb-8">Skaderapportering</h1>
      <form onSubmit={handleSubmit}>
        <TextArea
          label="Beskriv*"
          placeholder="Beskriv din skade og oplevelse..."
          name="description"
          type="text"
          onTextAreaChange={() => setError("")}
          value=""
        />

        {/* Validation/API fejl */}
        <div className="h-5">
          {error && <p className="text-red-500 small">{error}</p>}
        </div>
        <div className="pt-4 text-right">
          <PrimaryButton onClick={() => {}}>Indsend</PrimaryButton>
        </div>
      </form>
      <div className="small text-(--gray-60) pt-8 flex gap-1">
        <Link
          className="underline"
          href="https://forms.washworld.dk/f4a4d96f?lang=da"
          target="_blank"
          rel="noopener noreferrer"
        >
          Klik her
        </Link>
        <p>for yderligere spørgsmål til skaderapportering</p>
      </div>

      {/* Success popup */}
      {showSuccess && (
        <Popup
          title="Skaderapport er blevet indsendt"
          message="Du hører fra os indenfor 5 hverdage"
          submessage="Du bliver sendt videre om 5 sekunder..."
          icon={<Checkmark color={"var(--brand-green)"} size={50} />}
        />
      )}
    </div>
  );
}
