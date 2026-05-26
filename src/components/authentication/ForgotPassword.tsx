"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import Input from "@/components/global/forms/Input";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import Mail from "@/components/global/icons/grafik/Mail";
import Link from "next/link";
import { validateEmail, errorMessages } from "@/lib/form/validering";

export default function ForgotPassword() {
  const [params, setParams] = useState<User>({} as User);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const emailValid = validateEmail(params.user_email ?? "");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!emailValid) return;

    const response = await forgotPassword(params);

    if (!response.ok) {
      if (response.data?.error_code === "email_not_found") {
        setEmailNotFound(true);
      }
      return;
    }

    setSent(true);
  };

  // Når mailen er sendt - vis bekræftelse i stedet for formen
  if (sent) {
    return (
      <section className="flex flex-col items-center gap-10">
        <WashWorldLogo />

        <Mail size={150} color="var(--gray-5)" />

        <div className="flex flex-col gap-2 text-center">
          <h3>Tjek din e-mail</h3>
          <p className="extra-bold">
            Vi har sendt et link til {params.user_email}
          </p>
        </div>

        <Link href={"/"} className="text-center">
          <p className="underline">Tilbage til login</p>
        </Link>
      </section>
    );
  }

  return (
    <section>
      <WashWorldLogo />

      <div className="flex flex-col gap-2 my-12">
        <h1 className="text-center">Glemt kode?</h1>
        <p>
          Indtast din e mail og modtag et link til at nulstille din adgangskode
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4">
          <Mail color={"foreground"} size={40} />
          <Input
            label="E-mail*"
            error={(!!params.user_email && !emailValid) || emailNotFound}
            validated={emailValid}
            type="email"
            placeholder="navn@eksempel.com"
            value={params.user_email ?? ""}
            errorMessage={
              emailNotFound ? errorMessages.emailNotFound : errorMessages.email
            }
            onChange={(e) => {
              setParams({ ...params, user_email: e.target.value });
              setEmailNotFound(false);
            }}
          />
        </div>

        <div className="text-center mt-10 mb-4">
          <PrimaryButton disabled={!emailValid}>Send email</PrimaryButton>
        </div>

        <Link href={"/"} className="text-center">
          <p className="underline">Annuller</p>
        </Link>
      </form>
    </section>
  );
}
