"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Input from "@/components/global/forms/Input";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import Link from "next/link";

export default function ForgotPassword() {
  const [params, setParams] = useState<User>({} as User);
  const { login } = useAuth();
  const router = useRouter(); // Bruges da vi navigerer EFTER handleLogin() er kørt

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await login(params);
    // Det er vigtigt at dette sker EFTER login, da dashboardet kræver token for at kunne hente data fra backend.
    // Hvis vi navigerede til dashboardet FØR login, ville vi få en error, da der ikke ville være noget token i localStorage endnu.
    router.push("/dashboard"); // Her bruges router, og token er gemt i localStorage.
  };

  return (
    <section>
      <WashWorldLogo />

      <div className="flex flex-col gap-2 my-12">
        <h1 className="text-center">Glemt kode?</h1>
        <p>
          Indtast din e mail og modtag et link til at nulstille din adgangskode
        </p>
      </div>

      <form onSubmit={handleLogin}>
        <Input
          label="E-mail*"
          error={false}
          validated={false}
          type="email"
          placeholder="navn@eksempel.com"
          onChange={(e) => setParams({ ...params, user_email: e.target.value })}
        />

        <div className="text-center mt-10 mb-4">
          <PrimaryButton>Send email</PrimaryButton>
        </div>

        <Link href={"/"} className="text-center">
          <p className="underline">Annuller</p>
        </Link>
      </form>
    </section>
  );
}
