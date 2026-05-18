"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Input from "@/components/global/forms/Input";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";

export default function Home() {
  const [params, setParams] = useState<User>({} as User);
  const { login } = useAuth();
  const router = useRouter(); // Bruges da vi navigerer EFTER handleLogin() er kørt

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await login(params);
    // Det er vigtigt at dette sker EFTER login, da dashboardet kræver token for at kunne hente data fra backend.
    // Hvis vi navigerede til dashboardet FØR login, ville vi få en error, da der ikke ville være noget token i localStorage endnu.
    router.push("/dashboard"); // Her bruges router, og token er gemt i localStorage.
  };

  return (
    <div>
      <section>
        <ProgressBar activeIndex={1} totalTime={120} />

        <form onSubmit={handleLogin}>
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
            label="Kode*"
            error={false}
            validated={false}
            type="password"
            placeholder="123456"
            onChange={(e) =>
              setParams({ ...params, user_hashed_password: e.target.value })
            }
          />

          <PrimaryButton>Login</PrimaryButton>
        </form>
      </section>
    </div>
  );
}
