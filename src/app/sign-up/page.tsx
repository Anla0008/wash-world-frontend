"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import Input from "@/components/global/forms/Input";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import Mail from "@/components/global/icons/grafik/Mail";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import Link from "next/link";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePlateNumber,
  getBackendFieldError,
} from "@/lib/form/validering";

export default function Signup() {
  const [params, setParams] = useState<User>({} as User);
  const [step, setStep] = useState(1);
  const { signup } = useAuth();

  // Backend-fejl - sættes hvis email eller nummerplade allerede er i brug
  const [emailTaken, setEmailTaken] = useState(false);
  const [plateTaken, setPlateTaken] = useState(false);

  // Validering - udregnes direkte fra params, ingen state nødvendig
  const emailValid = validateEmail(params.user_email ?? "");
  const firstNameValid = validateName(params.user_first_name ?? "");
  const lastNameValid = validateName(params.user_last_name ?? "");
  const passwordValid = validatePassword(params.user_hashed_password ?? "");
  const repeatPasswordValid =
    !!params.user_hashed_password &&
    params.user_hashed_password === params.user_repeat_hashed_password;
  const plateNumberValid = validatePlateNumber(params.plate_number ?? "");

  const step1Valid =
    emailValid &&
    firstNameValid &&
    lastNameValid &&
    passwordValid &&
    repeatPasswordValid &&
    plateNumberValid;

  const handleStep1Submit = async (e: any) => {
    e.preventDefault();
    if (!step1Valid) return;

    const response = await signup(params);
    const fieldError = getBackendFieldError(response);

    if (fieldError === "email") {
      setEmailTaken(true);
      return;
    }

    if (fieldError === "plate_number") {
      setPlateTaken(true);
      return;
    }

    setStep(2);
  };

  const handleSubmitSignup = (e: any) => {
    e.preventDefault();
    setStep(3);
  };

  return (
    <div>
      {/* ================================ STEP 1 =============================== */}
      {step === 1 && (
        <section className="grid gap-10">
          <WashWorldLogo />
          <ProgressBar activeIndex={1} />

          <form onSubmit={handleStep1Submit}>
            <h1 className="text-center">Opret bruger</h1>

            <Input
              label="E-mail*"
              error={(!!params.user_email && !emailValid) || emailTaken}
              validated={emailValid}
              type="email"
              placeholder="navn@eksempel.com"
              errorMessage={
                emailTaken
                  ? "Denne e-mail er allerede i brug"
                  : "Indtast en gyldig e-mail"
              }
              onChange={(e) => {
                setParams({ ...params, user_email: e.target.value });
                setEmailTaken(false);
              }}
            />

            <Input
              label="Fornavn*"
              error={!!params.user_first_name && !firstNameValid}
              validated={firstNameValid}
              type="text"
              placeholder="Anders"
              errorMessage="Fornavn skal være mellem 2 og 20 tegn"
              onChange={(e) =>
                setParams({ ...params, user_first_name: e.target.value })
              }
            />

            <Input
              label="Efternavn*"
              error={!!params.user_last_name && !lastNameValid}
              validated={lastNameValid}
              type="text"
              placeholder="Andersen"
              errorMessage="Efternavn skal være mellem 2 og 20 tegn"
              onChange={(e) =>
                setParams({ ...params, user_last_name: e.target.value })
              }
            />

            <Input
              label="Kode*"
              error={!!params.user_hashed_password && !passwordValid}
              validated={passwordValid}
              type="password"
              placeholder="123456"
              errorMessage="Koden skal være mindst 8 tegn"
              onChange={(e) =>
                setParams({ ...params, user_hashed_password: e.target.value })
              }
            />

            <Input
              label="Gentag kode*"
              error={
                !!params.user_repeat_hashed_password && !repeatPasswordValid
              }
              validated={repeatPasswordValid}
              type="password"
              placeholder="123456"
              errorMessage="Koderne matcher ikke"
              onChange={(e) =>
                setParams({
                  ...params,
                  user_repeat_hashed_password: e.target.value,
                })
              }
            />

            <Input
              label="Nummerplade*"
              error={(!!params.plate_number && !plateNumberValid) || plateTaken}
              validated={plateNumberValid}
              type="text"
              placeholder="AB12345"
              errorMessage={
                plateTaken
                  ? "Denne nummerplade er allerede i brug"
                  : "Indtast 2 bogstaver og 5 cifre (fx AB12345)"
              }
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                setParams({ ...params, plate_number: e.target.value });
                setPlateTaken(false);
              }}
            />

            <div className="text-center mt-10">
              <PrimaryButton disabled={!step1Valid}>Gå videre</PrimaryButton>
            </div>
          </form>

          <div className="flex flex-row gap-2">
            <p>Har du allerede en konto?</p>
            <Link href={"/"}>
              <p className="extra-bold underline">Log ind</p>
            </Link>
          </div>
        </section>
      )}

      {/* ================================ STEP 2 =============================== */}
      {step === 2 && (
        <section className="grid gap-10">
          <WashWorldLogo />
          <ArrowLeft onClick={() => setStep(1)} size={30} />
          <ProgressBar activeIndex={2} />

          <h1 className="text-center">Opret bruger</h1>
          <form onSubmit={handleSubmitSignup}>
            <h3>Kortoplysninger</h3>
            <Input
              label="Kortnummer*"
              error={false}
              validated={false}
              type="text"
              placeholder="1234 5678 9012 3456"
              disabled={true}
            />
            <Input
              label="Navn på kort*"
              error={false}
              validated={false}
              type="text"
              placeholder="Anders Andersen"
              disabled={true}
            />
            <div className="flex flex-row gap-6">
              <Input
                label="Udløbsdato*"
                error={false}
                validated={false}
                type="text"
                placeholder="01/01/2000"
                disabled={true}
              />
              <Input
                label="CVC*"
                error={false}
                validated={false}
                type="text"
                placeholder="1234"
                disabled={true}
              />
            </div>

            <div className="text-center mt-10">
              <PrimaryButton>Opret bruger</PrimaryButton>
            </div>
          </form>
        </section>
      )}

      {/* ================================ STEP 3 =============================== */}
      {step === 3 && (
        <section className="flex flex-col items-center gap-10">
          <WashWorldLogo />
          <ArrowLeft onClick={() => setStep(2)} size={30} />
          <ProgressBar activeIndex={3} />

          <h1>Du er der næsten!</h1>

          <Mail size={150} color="var(--gray-5)" />

          <div className="flex flex-col gap-2 text-center">
            <h3>Verificer din e-mail</h3>
            <p className="extra-bold">
              Valideringskode sendt til {params.user_email}
            </p>
          </div>

          <div className="flex flex-row gap-2 text-center">
            <p>Har du ikke modtaget en mail?</p>
            <Link href={"/"}>
              <p className="extra-bold underline">Send igen</p>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
