"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import PrimaryButtonAnchorTag from "@/components/global/buttons/anchortag/PrimaryButtonAnchorTag";
import Input from "@/components/global/forms/Input";
import ProgressBar from "@/components/global/grafik/ProgressBar";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";

export default function Home() {
  const [params, setParams] = useState<User>({} as User);
  const { login } = useAuth();

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();

    const response = await login(params);

    console.log(response);
  };

  return (
    <div>
      {/* =================== STEP 1 ================== */}
      <section>
        <ProgressBar activeIndex={1} />

        <form onSubmit={handleSubmitLogin}>
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

          <PrimaryButtonAnchorTag href="/dashboard">
            Login
          </PrimaryButtonAnchorTag>
        </form>
      </section>
    </div>
  );
}
