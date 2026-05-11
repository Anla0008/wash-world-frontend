"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import PrimaryButton from "@/components/global/buttons/onClick/PrimaryButton";
import Input from "@/components/global/forms/Input";
import ProgressBar from "@/components/global/grafik/ProgressBar";
// Vi henter User (email, password osv. hentes én gang)

export default function Signup() {
  const [params, setParams] = useState<User>({} as User);
  const { signup } = useAuth();

  const handleSubmitSignup = async (e: any) => {
    e.preventDefault();

    const response = await signup(params);

    console.log(response);
  };

  return (
    <div>
      {/* =================== STEP 1 ================== */}
      <section>
        <ProgressBar activeIndex={1} />
        <h2 className="mt-4">Opret bruger</h2>

        <form onSubmit={handleSubmitSignup}>
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

          <div className="mt-12 text-center">
            <PrimaryButton>Gå videre</PrimaryButton>
          </div>
        </form>
      </section>

      {/* =================== STEP 2 ================== */}
      <section>
        <ProgressBar activeIndex={2} />
        <h2 className="mt-4 text-center">Opret bruger</h2>

        <form onSubmit={handleSubmitSignup}>
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
              />

              <Input
                label="CVC*"
                error={false}
                validated={false}
                type="password"
                placeholder="1234"
                onChange={(e) =>
                  setParams({ ...params, user_hashed_password: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <PrimaryButton>Opret bruger</PrimaryButton>
          </div>
        </form>
      </section>
    </div>
  );
}
