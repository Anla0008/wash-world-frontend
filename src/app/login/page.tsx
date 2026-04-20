"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();

    console.log(email, password);

    const response = await login(email, password);

    console.log(response);
  };

  return (
    <div>
      <form onSubmit={handleSubmitLogin}>
        <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
