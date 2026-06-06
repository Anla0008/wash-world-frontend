"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Egne komponenter og funktioner
import Input from "@/components/global/forms/Input";
import Lock from "@/components/global/icons/grafik/Lock";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import { validatePassword, errorMessages } from "@/lib/form/validering";

export default function ResetPassword({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = use(params);
  const router = useRouter();
  const { validateResetKey, resetPassword } = useAuth();

  // State til at holde alle brugerinput samlet i et objekt (params2), samt state til at håndtere fejl og succes
  const [params2, setParams] = useState<User>({} as User);
  const [passwordsNoMatch, setPasswordsNoMatch] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validering af inputfelterne, som opdateres i realtid mens brugeren skriver.
  const passwordValid = validatePassword(params2.user_hashed_password ?? "");
  const repeatPasswordValid =
    !!params2.user_hashed_password &&
    params2.user_hashed_password === params2.user_repeat_hashed_password;

  const formValid = passwordValid && repeatPasswordValid;

  // ResetPassword har en useEffect der validerer nøglen i URL'en
  // Den tjekker at linket (fra forgotpassword) faktisk er gyldigt inden man kan indtaste en ny adgangskode
  useEffect(() => {
    async function handleValidateKey() {
      const response = await validateResetKey(key);
      if (!response.ok) {
        router.push("/");
      }
    }
    handleValidateKey();
  }, []);

  // Når brugeren trykker på "Nulstil adgangskode" knappen, skal den først tjekke om formen er valid.
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formValid) return;

    const response = await resetPassword(params2, key);

    if (!response.ok) {
      if (response.data?.error_code === "passwords_do_not_match") {
        setPasswordsNoMatch(true);
      }
      return;
    }

    setSuccess(true);
  };

  // Hvis passwordet er succesfuldt nulstillet, vises en bekræftelsesbesked og en knap til at gå tilbage til login.
  if (success) {
    return (
      <section className="flex flex-col items-center gap-10">
        <WashWorldLogo />
        <div className="flex flex-col gap-2 text-center">
          <h2>Adgangskode nulstillet</h2>
          <p>
            Din adgangskode er blevet ændret! Gå til login siden for at logge
            ind med din nye adgangskode.
          </p>
        </div>
        <Link href={"/"} className="text-center">
          <p className="underline">Gå til login</p>
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-10">
      <WashWorldLogo />
      <h2 className="text-center">Nulstil adgangskode</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Lock color={"foreground"} size={40} />
          <Input
            label="Kode*"
            error={!!params2.user_hashed_password && !passwordValid}
            validated={passwordValid}
            type="password"
            placeholder="123456"
            value={params2.user_hashed_password ?? ""}
            errorMessage={errorMessages.password}
            onChange={(e) =>
              setParams({ ...params2, user_hashed_password: e.target.value })
            }
            isPassword={true}
          />
        </div>

        <div className="flex items-center gap-4">
          <Lock color={"foreground"} size={40} />
          <Input
            label="Gentag kode*"
            error={
              (!!params2.user_repeat_hashed_password && !repeatPasswordValid) ||
              passwordsNoMatch
            }
            validated={repeatPasswordValid}
            type="password"
            placeholder="123456"
            value={params2.user_repeat_hashed_password ?? ""}
            errorMessage={errorMessages.repeatPassword}
            onChange={(e) => {
              setParams({
                ...params2,
                user_repeat_hashed_password: e.target.value,
              });
              setPasswordsNoMatch(false);
            }}
            isPassword={true}
          />
        </div>

        <div className="text-center mt-10 mb-4">
          <PrimaryButton disabled={!formValid}>
            Nulstil adgangskode
          </PrimaryButton>
        </div>

        <Link href={"/"} className="text-center">
          <p className="underline">Annuller</p>
        </Link>
      </form>
    </section>
  );
}
