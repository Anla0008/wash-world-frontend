"use client";

import ProfileInformationWrapper from "@/components/profil/ProfileInformationWrapper";
import SubscriptionCard from "@/components/global/cards/SubscriptionCard";
import DeleteUserButton from "@/components/global/buttons/onClick/DeleteUserButton";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import { washData } from "@/mockupData/washData";
import { useRouter } from "next/navigation";

export default function ProfileInformation() {
  const router = useRouter();

  return (
    <div>
      <ArrowLeft onClick={() => router.push("/profil")} size={30} />

      <h1 className="extra-bold pb-8">Profiloplysninger</h1>

      <ProfileInformationWrapper></ProfileInformationWrapper>
      <h2 className="extra-bold pt-8">Opdater til abonnement</h2>{/*TODO: tjek om brugeren har abonnement */}
      <SubscriptionCard washData={washData}></SubscriptionCard>
      <div className="flex justify-center mt-18">
        <DeleteUserButton />
      </div>
    </div>
  );
}
