"use client";

import AbbonomenterCard from "@/components/global/cards/AbbonomenterCard";
import MinProfilCard from "@/components/profil/MinProfilCard";
import PointCard from "@/components/global/cards/PointCard";
import KundeserviceCard from "@/components/global/cards/KundeserviceCard";
import FAQ from "@/components/global/cards/FAQ";
import DeleteUserButton from "@/components/global/buttons/onClick/DeleteUserButton";

export default function Profil() {
  return (
    <div>
      <h1 className="extra-bold pb-8">Navn</h1> {/*TODO: Hent navn fra backend */}
      <MinProfilCard></MinProfilCard>
      <h2 className="extra-bold pt-10">Abonnementer</h2>
      <AbbonomenterCard></AbbonomenterCard>
      <h2 className="extra-bold pt-10">Dine point</h2>
      <PointCard></PointCard>
      <div className="mt-14 mb-20">
        <KundeserviceCard></KundeserviceCard>
      </div>
      <FAQ></FAQ>
      <div className="flex justify-center mt-18">
        {/* Button stylet om tertriary button, men med log ud logik op – bruges KUN her */}
        {/* JWT er stateless – log ud sker ved at slette tokenet lokalt */}
        <button
          className="bg-foreground text-background relative px-5 pr-10 py-2 w-fit extra-bold"
          style={{
            clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
            boxShadow: "inset -10px -10px 20px #121212, inset 20px 20px 30px rgba(255, 255, 255, 0.25)",
          }}
          onClick={() => {
            localStorage.removeItem("token"); // Sletter tokenet fra browseren
            window.location.href = "/"; // Sender brugeren til forsiden
          }}
        >
          Log ud
        </button>
      </div>
      <div className="flex justify-center mt-18">
        <DeleteUserButton></DeleteUserButton>
      </div>
    </div>
  );
}
