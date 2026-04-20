"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";

export default function Login() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // Vi henter User (email, password osv. hentes én gang)
  const [params, setParams] = useState<User>({} as User);

  const { login } = useAuth();

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();

    const response = await login(params);

    console.log(response);
  };

  return (
    <div>
      <form onSubmit={handleSubmitLogin}>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setParams({ ...params, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="password"
          onChange={(e) => setParams({ ...params, password: e.target.value })}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
