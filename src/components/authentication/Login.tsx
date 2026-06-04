"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import {
  validateEmail,
  validatePassword,
  errorMessages,
} from "@/lib/form/validering";
import Input from "@/components/global/forms/Input";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import Image from "next/image";
import Link from "next/link";
import Lock from "@/components/global/icons/grafik/Lock";
import Mail from "@/components/global/icons/grafik/Mail";
import Eye from "../global/icons/validation/Eye";

export default function Login() {
  const [params, setParams] = useState<User>({} as User);
  const [loginFailed, setLoginFailed] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const emailValid = validateEmail(params.user_email ?? "");
  const passwordValid = validatePassword(params.user_hashed_password ?? "");

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
        className="animate-[drive-in_10s_ease-in-out_infinite]"
      />

      <form onSubmit={handleLogin} className="flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <Mail color={"foreground"} size={40} />
          <Input
            label="E-mail*"
            error={(!!params.user_email && !emailValid) || loginFailed}
            validated={emailValid && !loginFailed}
            type="email"
            placeholder="navn@eksempel.com"
            value={params.user_email ?? ""}
            errorMessage={
              loginFailed ? errorMessages.loginFailed : errorMessages.email
            }
            onChange={(e) => {
              setParams({ ...params, user_email: e.target.value });
              setLoginFailed(false);
            }}
            isPassword={false}
          />
        </div>

        <div>
          <div className="flex items-center gap-4">
            <Lock color={"foreground"} size={40} />
            <Input
              label="Adgangskode*"
              error={
                (!!params.user_hashed_password && !passwordValid) || loginFailed
              }
              validated={passwordValid && !loginFailed}
              type="password"
              placeholder="123456"
              value={params.user_hashed_password ?? ""}
              errorMessage={
                loginFailed ? errorMessages.loginFailed : errorMessages.password
              }
              onChange={(e) => {
                setParams({ ...params, user_hashed_password: e.target.value });
                setLoginFailed(false);
              }}
              isPassword={true}
            />
       
          </div>
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
