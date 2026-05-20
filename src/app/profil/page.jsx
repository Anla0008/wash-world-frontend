import AbbonomenterCard from "@/components/global/cards/AbbonomenterCard";
import MinProfilCard from "@/components/profil/MinProfilCard";
import PointCard from "@/components/global/cards/PointCard";
import KundeserviceCard from "@/components/global/cards/KundeserviceCard";
import FAQ from "@/components/global/cards/FAQ";
import PrimaryButtonAnchorTag from "@/components/global/buttons/anchortag/PrimaryButtonAnchorTag";
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
        {/* TODO: Log ud funktionalitet skal implementeres i backend, og denne knap skal linke til den endpoint, der håndterer log ud */}
        <PrimaryButtonAnchorTag href="/logud" className="text-center">
          Log ud
        </PrimaryButtonAnchorTag>
      </div>
      <div className="flex justify-center mt-18">
        <DeleteUserButton></DeleteUserButton>
      </div>
    </div>
  );
}
