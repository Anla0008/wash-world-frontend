"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";

// Vi henter User (email, password osv. hentes én gang)
const [params, setParams] = useState<User>({} as User);

const { signup } = useAuth();

const handleSubmitSignup = async (e: any) => {
  e.preventDefault();

  const response = await signup(params);

  console.log(response);
};

export default function Signup() {
  return (
    <div>
      <form onSubmit={handleSubmitSignup}>
        <input
          type="text"
          placeholder="email"
          onChange={(e) => setParams({ ...params, username: e.target.value })}
        />

        <input
          type="text"
          name="name"
          id=""
          placeholder="name"
          onChange={(e) => setParams({ ...params, firstname: e.target.value })}
        />

        <input
          type="password"
          placeholder="password"
          onChange={(e) => setParams({ ...params, password: e.target.value })}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
