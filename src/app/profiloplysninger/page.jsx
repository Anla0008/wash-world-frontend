"use client";

import ProfilOplysningerWrapper from "@/components/profil/ProfilOplysningerWrapper";
import AbbonomenterCard from "@/components/global/cards/AbbonomenterCard";
import DeleteUserButton from "@/components/global/buttons/onClick/DeleteUserButton";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";

import { useRouter } from "next/navigation";

export default function Profiloplysninger() {
  const router = useRouter();

  return (
    <div>
      <ArrowLeft onClick={() => router.push("/profil")} size={30} />
      <h1 className="extra-bold pb-8">Profiloplysninger</h1>
      <ProfilOplysningerWrapper></ProfilOplysningerWrapper>
      <h2 className="extra-bold pt-8">Opdater til abonnement</h2> {/*TODO: tjek om brugeren har abonnement */}
      <AbbonomenterCard></AbbonomenterCard>
      <div className="flex justify-center mt-18">
        <DeleteUserButton></DeleteUserButton>
      </div>
    </div>
  );
}
