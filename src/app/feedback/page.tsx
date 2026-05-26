"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import TextArea from "@/components/global/forms/TextArea";
import Smileys from "@/components/global/icons/grafik/Smileys";
import Popup from "@/components/global/cards/PopUp";
import Checkmark from "@/components/global/icons/grafik/Checkmark";

import { useFeedback } from "@/hooks/useFeedback";
import { FeedbackProps } from "@/types/feedback";

export default function Feedback() {
  const [params, setParams] = useState<FeedbackProps>({} as FeedbackProps); // Gemmer alt feedback-data fra brugeren
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // Styrer success popup

  const { sendFeedback } = useFeedback();

  const router = useRouter();

  //Opdaterer rating i state
  const handleRatingSelect = (rating: number) => {
    setParams((prev) => ({
      ...prev,
      rating: rating === 0 ? undefined : rating, // 0 = deselect → undefined
    }));
    if (rating !== 0) setError(""); // Ryd kun fejl når noget vælges
  };

  // Opdaterer kommentar i state
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParams((prev) => ({
      ...prev,
      comment: e.target.value,
    }));
  };

  // Kører når brugeren klikker submit
  const handleSubmitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Forhindrer browser refresh

    // Validation: hvis ingen rating er valgt, stoppes submit og fejl vises
    if (!params.rating) {
      setError("Vælg venligst en smiley.");
      return;
    }

    setError(""); // Rydder gammel fejl

    try {
      await sendFeedback(params); // Sender feedback til backend
      setShowSuccess(true); // Viser success popup
      setTimeout(() => router.push("/dashboard"), 5000); // Redirect efter 5 sekunder
    } catch (error) {
      // Fejlhåndtering
      console.error(error);
      setError("Der opstod en fejl. Prøv igen senere.");
    }
  };

  return (
    <section>
      <h1>Feedback</h1>

      <form onSubmit={handleSubmitFeedback}>
        <Smileys onSelect={handleRatingSelect} />

        {/* Validation/API fejl */}
        <div className="h-5">
          {error && (
            <p
              className={` text-red-500 small ${error ? "opacity-100" : "opacity-0"}`}
            >
              {error}
            </p>
          )}
        </div>

        <TextArea
          label="Feedback"
          placeholder="Her kan du uddybe din feedback..."
          type="text"
          onTextAreaChange={handleCommentChange}
        />

        <div className="mt-12 text-right">
          <PrimaryButton>Indsend</PrimaryButton>
        </div>
      </form>

      {/* Success popup */}
      {showSuccess && (
        <Popup
          title="Tak for din feedback!"
          message="Du bliver sendt videre om 5 sekunder..."
          icon={<Checkmark color={"var(--brand-green)"} size={50} />}
        />
      )}
    </section>
  );
}
