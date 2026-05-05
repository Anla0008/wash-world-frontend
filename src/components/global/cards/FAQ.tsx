import { useState } from "react";
import OpenAndClose from "../icons/navigation/OpenAndClose";
import { FAQItem } from "@/types/FAQItem";

// Definerer typen for hvert accordion item

const items: FAQItem[] = [
  {
    title: "Hvor har Wash World vask selv henne?",
    content: (
      <p>
        Vi tilbyder kun Vask Selv på udvalgte lokationer, men vi åbner hele tiden flere. Du kan finde en oversigt over vores Vask Selv stationer{" "}
        <a href="https://washworld.dk/vask-selv" target="_blank" className="underline text-(--blue-selected)">
          her
        </a>
        .
      </p>
    ),
  },
  {
    title: "Hvad koster et abonemment med ubegrænset vask?",
    content: (
      <p>
        Vi tilbyder tre forskellige abonnementer med ubegrænset vask. Læs mere om vores abonnementer{" "}
        <a href="/profil" className="underline text-(--blue-selected)">
          her
        </a>
        .
      </p>
    ),
  },
  {
    title: "Kan jeg vaske i alle jeres vaskehaller?",
    content: (
      <>
        Med enkeltvask kan du benytte alle vaskehaller uden ekstra betaling. Med abonnement vælger du en primær lokation – hvis du vil vaske på andre lokationer koster det 10 kr. pr. vask.
        <br /> <br />
        Vil du have adgang til alle vores vaskehaller i landet med dit abonnement, kan du opgradere med en tillægspris på 10 kr. pr. måned!
      </>
    ),
  },
];

export default function FAQ() {
  // State til hvilken FAQ der er åben
  const [openIndex, setOpenIndex] = useState<number | null>(0); // første åben som default. Hvis alle skal være lukket til at starte med, skiftes til null i stedet for 0

  return (
    <section className="bg-(--gray-60) p-6 rounded-md">
      <h2 className="gray-5">FAQ</h2>

      <div className="space-y-3 max-w-lg w-full">
        {/* Map igennem FAQ items og render dem */}
        {items.map((item, index) => {
          const isOpen = openIndex === index; // Tjekker om det aktuelle item er åbent

          return (
            <div key={index} className={`rounded-md overflow-hidden transition ${isOpen ? "bg-(--gray-10) text-(--foreground-reverse)" : "bg-(--gray-80)"}`}>
              {/* TITLE */}
              <button onClick={() => setOpenIndex(isOpen ? null : index)} className="flex items-center justify-between p-4 text-left w-full hover:cursor-pointer">
                <span>{item.title}</span>

                <OpenAndClose isOpen={isOpen} />
              </button>

              {/* CONTENT */}
              <div className={`px-4 pb-4 transition-all duration-300 light ${isOpen ? "max-h-auto opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>{item.content}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
