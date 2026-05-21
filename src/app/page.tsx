"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Input from "@/components/global/forms/Input";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import Image from "next/image";
import Link from "next/link";
import { errorMessages } from "@/lib/form/validering";

export default function Home() {
  const [params, setParams] = useState<User>({} as User);
  const [loginFailed, setLoginFailed] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const response = await login(params);

    // Hvis backend afviste login (forkert email eller kodeord)
    if (response?.error) {
      setLoginFailed(true);
      return;
    }

    // Det er vigtigt at dette sker EFTER login, da dashboardet kræver token
    // for at kunne hente data fra backend. Hvis vi navigerede til dashboardet
    // FØR login, ville vi få en error, da der ikke ville være noget token
    // i localStorage endnu.
    router.push("/dashboard"); // Her bruges router, og token er gemt i localStorage.
  };

  return (
    <section className="flex flex-col gap-10">
      <WashWorldLogo />

      <Image
        src="/brand/washworld_car.svg"
        alt="WashWorld car"
        width={238}
        height={129}
        style={{ width: 238, height: 129 }}
        loading="eager"
      />

      <form onSubmit={handleLogin}>
        <Input
          label="E-mail*"
          error={loginFailed}
          validated={false}
          type="email"
          placeholder="navn@eksempel.com"
          value={params.user_email ?? ""}
          errorMessage={errorMessages.loginFailed}
          onChange={(e) => {
            setParams({ ...params, user_email: e.target.value });
            setLoginFailed(false);
          }}
        />

        <div>
          <Input
            label="Kode*"
            error={loginFailed}
            validated={false}
            type="password"
            placeholder="123456"
            value={params.user_hashed_password ?? ""}
            errorMessage={errorMessages.loginFailed}
            onChange={(e) => {
              setParams({ ...params, user_hashed_password: e.target.value });
              setLoginFailed(false);
            }}
          />
          <Link href={"/forgot-password"} className="flex justify-end mt-2">
            <p className="underline light">Glemt kodeord?</p>
          </Link>
        </div>

        <div className="text-center mt-10">
          <PrimaryButton>Login</PrimaryButton>
        </div>
      </form>

      <div className="flex flex-row gap-2 justify-center">
        <p>Har du ikke en konto?</p>
        <Link href={"/sign-up"}>
          <p className="extra-bold underline">Opret bruger</p>
        </Link>
      </div>
    </section>
  );
}
