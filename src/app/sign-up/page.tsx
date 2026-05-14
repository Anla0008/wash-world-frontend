"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import Input from "@/components/global/forms/Input";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import Image from "next/image";
import ArrowLeft from "@/components/global/icons/navigation/ArrowLeft";
import Mail from "@/components/global/icons/grafik/Mail";
import WashWorldLogo from "@/components/global/icons/grafik/WashWorldLogo";

import Link from "next/link";

export default function Signup() {
  // Gemmer alle brugerens input værdier (email, navn, kode osv.)
  const [params, setParams] = useState<User>({} as User);

  // Holder styr på hvilket step brugeren er på (starter på 1)
  const [step, setStep] = useState(1);

  // Henter signup funktionen fra vores auth hook
  const { signup } = useAuth();

  // Kaldes når brugeren trykker på "Opret bruger" knappen i step 2
  const handleSubmitSignup = async (e: any) => {
    // Forhindrer siden i at reloade når formen submittes
    e.preventDefault();

    // Sender brugerens data til backend og venter på svar
    const response = await signup(params);

    // Logger svaret fra backend så vi kan se om det gik godt
    console.log(response);
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
              error={false}
              validated={false}
              type="email"
              placeholder="navn@eksempel.com"
              onChange={(e) =>
                setParams({ ...params, user_email: e.target.value })
              }
            />
            <Input
              label="Fornavn*"
              error={false}
              validated={false}
              type="text"
              placeholder="Anders"
              onChange={(e) =>
                setParams({ ...params, user_first_name: e.target.value })
              }
            />
            <Input
              label="Efternavn*"
              error={false}
              validated={false}
              type="text"
              placeholder="Andersen"
              onChange={(e) =>
                setParams({ ...params, user_last_name: e.target.value })
              }
            />
            <Input
              label="Kode*"
              error={false}
              validated={false}
              type="password"
              placeholder="123456"
              onChange={(e) =>
                setParams({ ...params, user_hashed_password: e.target.value })
              }
            />
            <Input
              label="Gentag kode*"
              error={false}
              validated={false}
              type="password"
              placeholder="123456"
              onChange={(e) =>
                setParams({
                  ...params,
                  user_repeat_hashed_password: e.target.value,
                })
              }
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
          >
            <h1 className="text-center">Opret bruger</h1>

            <Input
              label="Nummerplade*"
              error={false}
              validated={false}
              type="text"
              placeholder="AB 123 456"
              onChange={(e) =>
                setParams({ ...params, user_email: e.target.value })
              }
            />

            <div className="mt-18">
              <h3>Kortoplysninger</h3>
              <Input
                label="Navn på kort*"
                error={false}
                validated={false}
                type="text"
                placeholder="Anders Andersen"
                onChange={(e) =>
                  setParams({ ...params, user_first_name: e.target.value })
                }
                disabled={true}
              />
              <div className="flex flex-row gap-6">
                <Input
                  label="Udløbsdato*"
                  error={false}
                  validated={false}
                  type="text"
                  placeholder="01/01/2000"
                  onChange={(e) =>
                    setParams({ ...params, user_last_name: e.target.value })
                  }
                  disabled={true}
                />

                <Input
                  label="CVC*"
                  error={false}
                  validated={false}
                  type="text"
                  placeholder="1234"
                  onChange={(e) =>
                    setParams({
                      ...params,
                      user_hashed_password: e.target.value,
                    })
                  }
                  disabled={true}
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
