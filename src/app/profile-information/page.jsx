"use client";

import ProfileInfoCard from "@/components/profil/ProfileInfoCard";
import SubscriptionCard from "@/components/global/cards/SubscriptionCard";
import DeleteUserButton from "@/components/global/buttons/onClick/DeleteUserButton";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import { useRouter } from "next/navigation";

export default function ProfileInformation() {
  const router = useRouter();


  return (
    <div>
      <ArrowLeft onClick={() => router.push("/profil")} size={30} />

      <h1 className="extra-bold pb-8">Profiloplysninger</h1>

      <ProfileInfoCard />

      <div className="flex flex-col -mr-8 mt-14">
        <h2 className="extra-bold">Abonnementer</h2>
        <SubscriptionCard />
      </div>

      <div className="flex justify-center mt-14">
        <DeleteUserButton />
      </div>
    </div>
  );
}
