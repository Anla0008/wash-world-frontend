"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getUser } from "@/hooks/useAuth";
import { useWash } from "@/hooks/useWash";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import Input from "@/components/global/forms/Input";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";

export default function Home() {
  const [params, setParams] = useState<User>({} as User);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    const response = await login(params);
    const { getUserData } = getUser();
    const user = getUserData();

    console.log(response);
  };

  return (
    <div>
      {/* =================== STEP 1 ================== */}
      <section>
        <ProgressBar activeIndex={1} totalTime={120} />

        <form>
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

          <PrimaryButton onClick={handleLogin}>
            Login
          </PrimaryButton>
        </form>
      </section>
    </div>
  );
}
