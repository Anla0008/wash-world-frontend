"use client";

import SubscriptionCard from "@/components/global/cards/SubscriptionCard";
import MyProfileCard from "@/components/profil/MyProfileCard";
import CustomerServiceCard from "@/components/global/cards/CustomerServiceCard";
import FAQ from "@/components/global/cards/FAQ";
import DeleteUserButton from "@/components/global/buttons/onClick/DeleteUserButton";

import { useEffect, useState } from "react";

export default function Profil() {
  const [user_pk, setUserPk] = useState(null);
  const firstName = localStorage.getItem("user_first_name");

  useEffect(() => {
    // Decoder JWT token for at hente brugerens user_pk
    // JWT består af tre base64-dele adskilt af punktum — vi tager midterste del (payload)
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserPk(decoded.sub); // Flask gemmer user_pk i "sub"-feltet via create_access_token
    }
  }, []);

  return (
    <div>
      <h1 className="extra-bold pb-8">Hej {firstName}</h1>
      {/*TODO: Hent navn fra backend */}
      <MyProfileCard />
      <h2 className="extra-bold pt-10">Abonnementer</h2>
      <div className="mt-14 mb-20">
        <CustomerServiceCard></CustomerServiceCard>
      </div>
      <FAQ></FAQ>
      <div className="flex justify-center mt-18">
        {/* Button stylet om tertriary button, men med log ud logik op – bruges KUN her */}
        {/* JWT er stateless – log ud sker ved at slette tokenet lokalt */}
        <button
          className="bg-foreground text-background relative px-5 pr-10 py-2 w-fit extra-bold"
          style={{
            clipPath: "polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)",
            boxShadow:
              "inset -10px -10px 20px #121212, inset 20px 20px 30px rgba(255, 255, 255, 0.25)",
          }}
          onClick={() => {
            localStorage.removeItem("token"); // Sletter tokenet fra browseren
            window.location.href = "/"; // Sender brugeren til forsiden
          }}
        >
          Log ud
        </button>
      </div>
      <div className="flex justify-center mt-18">
        <DeleteUserButton
          user_pk={user_pk}
          onDeleted={() => (window.location.href = "/")}
        />
      </div>
    </div>
  );
}
