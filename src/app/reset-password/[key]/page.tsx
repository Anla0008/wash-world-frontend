"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import Input from "@/components/global/forms/Input";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validatePassword, errorMessages } from "@/lib/form/validering";

export default function ResetPassword({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = use(params);
  const router = useRouter();
  const { validateResetKey, resetPassword } = useAuth();

  const [params2, setParams] = useState<User>({} as User);
  const [passwordsNoMatch, setPasswordsNoMatch] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordValid = validatePassword(params2.user_hashed_password ?? "");
  const repeatPasswordValid =
    !!params2.user_hashed_password &&
    params2.user_hashed_password === params2.user_repeat_hashed_password;

  const formValid = passwordValid && repeatPasswordValid;

  useEffect(() => {
    async function handleValidateKey() {
      const response = await validateResetKey(key);
      if (!response.ok) {
        router.push("/");
      }
    }
    handleValidateKey();
  }, []);

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

  if (success) {
    return (
      <section className="flex flex-col items-center gap-10">
        <WashWorldLogo />
        <div className="flex flex-col gap-2 text-center">
          <h3>Adgangskode nulstillet!</h3>
          <p className="extra-bold">Din adgangskode er blevet ændret</p>
        </div>
        <Link href={"/"} className="text-center">
          <p className="underline">Gå til login</p>
        </Link>
      </section>
    );
  }

  return (
    <section>
      <WashWorldLogo />
      <h2 className="text-center">Nulstil adgangskode</h2>

      <form onSubmit={handleSubmit}>
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
        />
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
        />

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
