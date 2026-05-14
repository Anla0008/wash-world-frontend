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
} from "@/lib/form/validering";

export default function Signup() {
  // Gemmer alle brugerens input værdier (email, navn, kode osv.)
  const [params, setParams] = useState<User>({} as User);

  // Holder styr på hvilket step brugeren er på (starter på 1)
  const [step, setStep] = useState(1);

  // Henter signup funktionen fra vores auth hook
  const { signup } = useAuth();

  // En state per felt du vil validere
  const [emailError, setEmailError] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);

  const [firstNameError, setFirstNameError] = useState(false);
  const [firstNameValidated, setFirstNameValidated] = useState(false);

  const [lastNameError, setLastNameError] = useState(false);
  const [lastNameValidated, setLastNameValidated] = useState(false);

  const [passwordError, setPasswordError] = useState(false);
  const [passwordValidated, setPasswordValidated] = useState(false);

  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [repeatPasswordValidated, setRepeatPasswordValidated] = useState(false);

  const [plateNumberError, setPlateNumberError] = useState(false);
  const [plateNumberValidated, setPlateNumberValidated] = useState(false);

  // Kaldes når brugeren trykker på "Opret bruger" knappen i step 2
  const handleSubmitSignup = async (e: any) => {
    // Forhindrer siden i at reloade når formen submittes
    e.preventDefault();

    // Sender brugerens data til backend og venter på svar
    const response = await signup(params);

    // Logger svaret fra backend så vi kan se om det gik godt
    console.log(response);

    // Sætter step til 3 så vi kommer videre til næste del af flowet
    setStep(3);
  };

  return (
    <div>
      {/* ================================ STEP 1 =============================== */}
      {step === 1 && (
        <section className="grid gap-10">
          <WashWorldLogo />
          <ProgressBar activeIndex={1} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
          >
            <h1 className="text-center">Opret bruger</h1>

            <Input
              label="E-mail*"
              error={emailError}
              validated={emailValidated}
              type="email"
              placeholder="navn@eksempel.com"
              onChange={(e) => {
                const value = e.target.value;
                setParams({ ...params, user_email: value });

                // Validerer email med regex fra validation.ts
                setEmailValidated(validateEmail(value));
                setEmailError(!validateEmail(value));
              }}
            />

            <Input
              label="Fornavn*"
              error={firstNameError}
              validated={firstNameValidated}
              type="text"
              placeholder="Anders"
              onChange={(e) => {
                const value = e.target.value;
                setParams({ ...params, user_first_name: value });

                // Validerer fornavn med regex fra validation.ts (2-20 tegn)
                setFirstNameValidated(validateName(value));
                setFirstNameError(!validateName(value));
              }}
            />

            <Input
              label="Efternavn*"
              error={lastNameError}
              validated={lastNameValidated}
              type="text"
              placeholder="Andersen"
              onChange={(e) => {
                const value = e.target.value;
                setParams({ ...params, user_last_name: value });

                // Validerer efternavn med regex fra validation.ts (2-20 tegn)
                setLastNameValidated(validateName(value));
                setLastNameError(!validateName(value));
              }}
            />

            <Input
              label="Kode*"
              error={passwordError}
              validated={passwordValidated}
              type="password"
              placeholder="123456"
              onChange={(e) => {
                const value = e.target.value;
                setParams({ ...params, user_hashed_password: value });

                // Validerer kode med regex fra validation.ts (8-255 tegn)
                setPasswordValidated(validatePassword(value));
                setPasswordError(!validatePassword(value));
              }}
            />

            <Input
              label="Gentag kode*"
              error={repeatPasswordError}
              validated={repeatPasswordValidated}
              type="password"
              placeholder="123456"
              onChange={(e) => {
                const value = e.target.value;
                setParams({ ...params, user_repeat_hashed_password: value });

                // Tjekker om de to koder matcher hinanden
                setRepeatPasswordValidated(
                  value === params.user_hashed_password,
                );
                setRepeatPasswordError(value !== params.user_hashed_password);
              }}
            />

            <div className="text-center mt-10">
              <PrimaryButton>Gå videre</PrimaryButton>
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

          <form onSubmit={handleSubmitSignup}>
            <h1 className="text-center">Opret bruger</h1>

            <Input
              label="Nummerplade*"
              error={plateNumberError}
              validated={plateNumberValidated}
              type="text"
              placeholder="AB 12 345"
              onChange={(e) => {
                const value = e.target.value;
                setParams({ ...params, plate_number: e.target.value });

                // Validerer nummerplade med regex fra validation.ts (2 bogstaver + 5 cifre)
                setPlateNumberValidated(validatePlateNumber(value)); // 👈
                setPlateNumberError(!validatePlateNumber(value));
              }}
            />

            <div className="mt-18">
              <h3>Kortoplysninger</h3>
              <Input
                label="Navn på kort*"
                error={false}
                validated={false}
                type="text"
                placeholder="Anders Andersen"
                disabled={true}
                onChange={(e) =>
                  setParams({ ...params, user_first_name: e.target.value })
                }
              />
              <div className="flex flex-row gap-6">
                <Input
                  label="Udløbsdato*"
                  error={false}
                  validated={false}
                  type="text"
                  placeholder="01/01/2000"
                  disabled={true}
                  onChange={(e) =>
                    setParams({ ...params, user_last_name: e.target.value })
                  }
                />

                <Input
                  label="CVC*"
                  error={false}
                  validated={false}
                  type="text"
                  placeholder="1234"
                  disabled={true}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      user_hashed_password: e.target.value,
                    })
                  }
                />
              </div>
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
