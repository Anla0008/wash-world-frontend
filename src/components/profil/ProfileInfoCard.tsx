"use client";

// Her hentes ikoner fra grafik
import User from "@/components/global/icons/grafik/User";
import ProfileCard from "@/components/global/icons/grafik/ProfileCard";
import Mail from "@/components/global/icons/grafik/Mail";
import Card from "@/components/global/icons/grafik/Card";
import Checkmark from "@/components/global/icons/grafik/Checkmark";

// Her hentes globale komponenter
import Input from "@/components/global/forms/Input";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import Popup from "@/components/global/cards/PopUp";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import {
  validateEmail,
  validateName,
  errorMessages,
} from "@/lib/form/validering";

export default function ProfileInfoCard() {
  const { getProfileInfo, updateProfileInfo } = useAuth();

  // State til formfelter som forudfyldes med brugerens eksisterende data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Styrer success popup

  // Henter brugerens eksisterende oplysninger fra backend når komponenten loader
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfileInfo();
      if (!data) return;
      setFirstName(data.user_first_name ?? "");
      setLastName(data.user_last_name ?? "");
      setEmail(data.user_email ?? "");
      setPlateNumber(data.plate_number ?? "");
    };
    fetchData();
  }, []);

  // Validering som udregnes direkte fra state, ingen ekstra state nødvendig
  const firstNameValid = validateName(firstName);
  const lastNameValid = validateName(lastName);
  const emailValid = validateEmail(email);
  const formValid = firstNameValid && lastNameValid && emailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return; // Returner/submit kun hvis formen er valid

    // Sender PATCH request til backend med opdaterede oplysninger
    const result = await updateProfileInfo({
      user_first_name: firstName,
      user_last_name: lastName,
      user_email: email,
    });

    // Hvis backenden returnerer email_taken, vises fejl på email-feltet
    if (result?.error_code === "email_taken") {
      setEmailTaken(true);
    }

    // Opdaterer localStorage med det opdaterede fornavn (bruges på dashboard og profil)
    localStorage.setItem("user_first_name", firstName);
    setShowSuccess(true);
  };

  return (
    <section className="bg-(--gray-80) px-4 py-4 flex flex-col gap-5 rounded-md">
      <h3>Opdater oplysninger</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <User color={"white"} size={40} />
          <Input
            label="Fornavn"
            error={!!firstName && !firstNameValid}
            validated={firstNameValid}
            type="text"
            placeholder="Anders"
            value={firstName}
            errorMessage={errorMessages.firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <User color={"white"} size={40} />
          <Input
            label="Efternavn"
            error={!!lastName && !lastNameValid}
            validated={lastNameValid}
            type="text"
            placeholder="Andersen"
            value={lastName}
            errorMessage={errorMessages.lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Mail color={"white"} size={40} />
          <Input
            label="E-mail"
            error={(!!email && !emailValid) || emailTaken}
            validated={emailValid && !emailTaken}
            type="email"
            placeholder="navn@eksempel.com"
            value={email}
            errorMessage={
              emailTaken ? errorMessages.emailTaken : errorMessages.email
            }
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailTaken(false);
            }}
          />
        </div>

        {/* Betalingskort og nummerplade er disabled da de ikke kan ændres her */}
        <div className="flex items-center gap-4">
          <Card color={"white"} size={40} />
          <Input
            label="Betalingskort"
            error={false}
            validated={false}
            type="text"
            placeholder="xxxx xxxx xxxx 0000"
            value=""
            disabled={true}
          />
        </div>

        <div className="flex items-center gap-4">
          <ProfileCard color={"white"} size={40} />
          <Input
            label="Nummerplade"
            error={false}
            validated={false}
            type="text"
            placeholder="AB12345"
            value={plateNumber}
            disabled={true}
          />
        </div>

        <div className="text-center">
          <PrimaryButton disabled={!formValid}>Gem ændringer</PrimaryButton>
        </div>
      </form>

      {/* Success popup vises når oplysninger er gemt */}
      {showSuccess && (
        <Popup
          title="Oplysninger opdateret!"
          message="Dine ændringer er gemt."
          icon={<Checkmark color={"var(--brand-green)"} size={50} />}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </section>
  );
}
