"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDamageReport } from "@/hooks/useDamageReport";
import TextArea from "@/components/global/forms/TextArea";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import Popup from "@/components/global/cards/PopUp";
import Checkmark from "@/components/global/icons/grafik/Checkmark";

export default function Skaderapportering() {
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // Styrer success popup

  const { sendDamageReport } = useDamageReport();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract description from the form
    const form = new FormData(e.target);
    const description = form.get("description");

    // Validation fejl
    if (!description.trim()) {
      setError("Du skal beskrive din skade.");
      return;
    }

    setError(""); // Ryd gammel fejl

    try {
      await sendDamageReport(description, "test@test.dk");
      setShowSuccess(true);
      setTimeout(() => router.push("/dashboard"), 5000);
    } catch {
      setError("Der opstod en fejl. Prøv igen senere.");
    }
  };

  return (
    <div>
      <h1 className="extra-bold pb-8">Skaderapportering</h1>
      <form onSubmit={handleSubmit}>
        <TextArea label="Beskriv*" placeholder="Beskriv din skade og oplevelse..." name="description" type="text" onTextAreaChange={() => setError("")} />
        {/* Validation/API fejl */}
        <div className="h-5">{error && <p className="text-red-500 small">{error}</p>}</div>
        <div className="pt-4 text-right">
          <PrimaryButton type="submit">Indsend</PrimaryButton>
        </div>
      </form>

      <div className="small text-(--gray-60) pt-8 flex gap-1">
        <a className="underline" href="https://forms.washworld.dk/f4a4d96f?lang=da" target="_blank" rel="noopener noreferrer">
          Klik her
        </a>
        <p>for yderligere spørgsmål til skaderapportering</p>
      </div>
      {/* Success popup */}
      {showSuccess && <Popup title="Tak for din feedback!" message="Du bliver sendt videre om 5 sekunder..." icon={<Checkmark color={"var(--brand-green)"} size={50} />} />}
    </div>
  );
}
