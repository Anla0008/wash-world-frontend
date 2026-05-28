"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import Input from "@/components/global/forms/Input";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import Mail from "@/components/global/icons/grafik/Mail";
import Userr from "@/components/global/icons/grafik/User";
import Clock from "@/components/global/icons/grafik/Clock";
import Lock from "@/components/global/icons/grafik/Lock";
import ProfileCard from "@/components/global/icons/grafik/ProfileCard";
import Card from "@/components/global/icons/grafik/Card";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";
import Link from "next/link";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePlateNumber,
  getBackendFieldError,
  errorMessages,
} from "@/lib/form/validering";

export default function Signup() {
  const [params, setParams] = useState<User>({} as User);
  const [step, setStep] = useState(1);
  const { signup, checkEmail } = useAuth();

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

  // Step 1 → Step 2: tjek om email er ledig i db
  const handleStep1Submit = async (e: any) => {
    e.preventDefault();
    if (!step1Valid) return;

    const response = await checkEmail(params.user_email);
    if (!response.ok) {
      setEmailTaken(true);
      return;
    }

    setStep(2);
  };

  // Step 2 → Step 3: NU kaldes backend
  const handleSubmitSignup = async (e: any) => {
    e.preventDefault();

    const response = await signup(params);
    const fieldError = getBackendFieldError(response);

    if (fieldError === "email") {
      setEmailTaken(true);
      setStep(1);
      return;
    }

    if (fieldError === "plate_number") {
      setPlateTaken(true);
      setStep(1);
      return;
    }

    setStep(3);
  };

  return (
    <div>
      {/* ================================ STEP 1 =============================== */}
      {step === 1 && (
        <section className="grid gap-10">
          <WashWorldLogo />
          <ProgressBar activeIndex={1} />

          <form onSubmit={handleStep1Submit} className="flex flex-col gap-6">
            <h1 className="text-center">Opret bruger</h1>

            <div className="flex items-center gap-4">
              <Mail color={"foreground"} size={40} />
              <Input
                label="E-mail*"
                error={(!!params.user_email && !emailValid) || emailTaken}
                validated={emailValid}
                type="email"
                placeholder="navn@eksempel.com"
                value={params.user_email ?? ""}
                errorMessage={
                  emailTaken ? errorMessages.emailTaken : errorMessages.email
                }
                onChange={(e) => {
                  setParams({ ...params, user_email: e.target.value });
                  setEmailTaken(false);
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <Userr color={"foreground"} size={40} />
              <Input
                label="Fornavn*"
                error={!!params.user_first_name && !firstNameValid}
                validated={firstNameValid}
                type="text"
                placeholder="Anders"
                value={params.user_first_name ?? ""}
                errorMessage={errorMessages.firstName}
                onChange={(e) =>
                  setParams({ ...params, user_first_name: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-4">
              <Userr color={"foreground"} size={40} />
              <Input
                label="Efternavn*"
                error={!!params.user_last_name && !lastNameValid}
                validated={lastNameValid}
                type="text"
                placeholder="Andersen"
                value={params.user_last_name ?? ""}
                errorMessage={errorMessages.lastName}
                onChange={(e) =>
                  setParams({ ...params, user_last_name: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-4">
              <Lock color={"foreground"} size={40} />
              <Input
                label="Adgangskode*"
                error={!!params.user_hashed_password && !passwordValid}
                validated={passwordValid}
                type="password"
                placeholder="123456"
                value={params.user_hashed_password ?? ""}
                errorMessage={errorMessages.password}
                onChange={(e) =>
                  setParams({ ...params, user_hashed_password: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-4">
              <Lock color={"foreground"} size={40} />
              <Input
                label="Gentag adgangskode*"
                error={
                  !!params.user_repeat_hashed_password && !repeatPasswordValid
                }
                validated={repeatPasswordValid}
                type="password"
                placeholder="123456"
                value={params.user_repeat_hashed_password ?? ""}
                errorMessage={errorMessages.repeatPassword}
                onChange={(e) =>
                  setParams({
                    ...params,
                    user_repeat_hashed_password: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-center gap-4">
              <ProfileCard color={"foreground"} size={40} />
              <Input
                label="Nummerplade*"
                error={
                  (!!params.plate_number && !plateNumberValid) || plateTaken
                }
                validated={plateNumberValid}
                type="text"
                placeholder="AB12345"
                value={params.plate_number ?? ""}
                errorMessage={
                  plateTaken ? errorMessages.plateTaken : errorMessages.plate
                }
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  setParams({ ...params, plate_number: e.target.value });
                  setPlateTaken(false);
                }}
              />
            </div>

            <div className="text-center mt-4">
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
          
        <div className="flex items-center gap-2 mb-4">
          <ArrowLeft onClick={() => setStep(1)} size={30} />
              Tilbage
          </div>

          <ProgressBar activeIndex={2} />

          <h1 className="text-center">Kortoplysninger</h1>
          <form onSubmit={handleSubmitSignup} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Card color={"foreground"} size={40} />
              <Input
                label="Kortnummer*"
                error={false}
                validated={false}
                type="text"
                value=""
                placeholder="1234 5678 9012 3456"
                disabled={true}
              />
            </div>

            <div className="flex items-center gap-4">
              <Userr color={"foreground"} size={40} />
              <Input
                label="Navn på kort*"
                error={false}
                validated={false}
                type="text"
                value=""
                placeholder="Anders Andersen"
                disabled={true}
              />
            </div>

            <div className="flex items-center gap-4">
              <Clock color={"foreground"} size={40} />
              <div className="flex flex-row gap-6">
                <Input
                  label="Udløbsdato*"
                  error={false}
                  validated={false}
                  type="text"
                  value=""
                  placeholder="01/01/2000"
                  disabled={true}
                />
                <Input
                  label="CVC*"
                  error={false}
                  validated={false}
                  type="text"
                  value=""
                  placeholder="1234"
                  disabled={true}
                />
              </div>
            </div>

            <div className="text-center mt-4">
              <PrimaryButton>Opret bruger</PrimaryButton>
            </div>
          </form>
        </section>
      )}

      {/* ================================ STEP 3 =============================== */}
      {step === 3 && (
        <section className="flex flex-col items-center gap-10">
          <WashWorldLogo />
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
