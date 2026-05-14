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
  const [params, setParams] = useState<FeedbackProps>({} as FeedbackProps);

  const { sendFeedback } = useFeedback();
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  const handleSubmitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendFeedback(params);
      setShowSuccess(true);
      setTimeout(() => router.push("/dashboard"), 5000);
    } catch (error) {
      console.error(error);
    }
  };

  // TODO - tilføje error håndtering ved click uden at have klikket smiley
  return (
    <section>
      <h1>Feedback</h1>

      <form onSubmit={handleSubmitFeedback}>
        <Smileys onSelect={(rating: any) => setParams((prev) => ({ ...prev, rating }))} />

        <TextArea label="Feedback" placeholder="Her kan du uddybe din feedback..." type="text" onTextAreaChange={(e) => setParams((prev) => ({ ...prev, comment: e.target.value }))} />

        <div className="mt-12 text-right">
          <PrimaryButton>Indsend</PrimaryButton>
        </div>
      </form>

      {showSuccess && <Popup title="Tak for din feedback!" message="Du bliver sendt videre om 5 sekunder..." icon={<Checkmark color={"var(--brand-green)"} size={50} />} />}
    </section>
  );
}
