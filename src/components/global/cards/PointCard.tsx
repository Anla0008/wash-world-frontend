"use client";
import { PointProps } from "@/types/point";
import Link from "next/link";

const PointCard = ({ points }: PointProps) => {
  const pointsData = [
    {
      rabat: "Gratis",
      type: "Vask selv",
      antal: 15,
      fyldetekst: null,
      href: "/favoritter",
    },
    {
      rabat: "-20%",
      type: "Premium Vask",
      antal: 200,
      fyldetekst: "på næste",
      href: "/favoritter",
    },
    {
      rabat: "Gratis",
      type: "Guldabonnement i en måned",
      antal: 1500,
      fyldetekst: null,
      href: "/favoritter",
    },
  ];

  return (
    <section className="max-w-lg w-full flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar pt-8 pb-8">
      {pointsData.map((point, index) => {
        // skal defineres her for at kunne bruges i både isAccessible og missingPoints da de begge er afhængige af points
        const isAccessible = points >= point.antal;
        const missingPoints = Math.max(point.antal - points, 0); // sørger for at det aldrig bliver negativt og at det ikke viser mere end point.antal
        const missingPointsMin = missingPoints > 50 ? null : missingPoints; // hvis der mangler mere end 50 point, vises det ikke
        const cardClassName = `relative shrink-0 w-52 px-4 pt-2 rounded-md flex flex-col gap-2 shadow-md  ${
          isAccessible ? "bg-(--brand-green)" : "bg-(--gray-10)/50"
        }`;

        const cardContent = (
          <>
            {!isAccessible && missingPointsMin !== null && (
              <div className="absolute -top-6 right-1 bg-(--splash) px-2 py-1 z-10">{`kun ${missingPointsMin} point fra!`}</div>
            )}

            <div className={!isAccessible ? "opacity-80" : ""}>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-2">
                  <h3
                    className={`extra-bold text-(--brand-green) uppercase ${isAccessible ? "text-foreground" : "text-(brand-green-reverse)"}`}
                  >
                    {point.rabat}
                  </h3>
                  {point.fyldetekst && (
                    <p className="text-background">{point.fyldetekst}</p>
                  )}
                </div>
                <h4 className="text-background extra-bold text-center min-h-12">
                  {point.type}!
                </h4>
              </div>
              <div className="flex justify-between items-baseline">
                {isAccessible ? (
                  <p className="extra-bold underline bg-(--brand-green-reverse) shadow-lg px-2 rounded-full text-(--gray-80)">
                    Indløs nu!
                  </p>
                ) : (
                  <div />
                )}
                <div className="flex items-baseline gap-2 justify-end">
                  <h2 className="text-background extra-bold">{point.antal}</h2>
                  <p className="text-background light">point</p>
                </div>
              </div>
            </div>
          </>
        );

        return isAccessible ? (
          <Link key={index} href={point.href} className={cardClassName}>
            {cardContent}
          </Link>
        ) : (
          <div key={index} className={cardClassName}>
            {cardContent}
          </div>
        );
      })}
    </section>
  );
};

export default PointCard;
