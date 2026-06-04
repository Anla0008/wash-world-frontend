"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClientProvider and QueryClient from react-query
import { ReactNode } from "react";

const queryClient = new QueryClient(); // New instance of QueryClient (variable), which will be used to manage the cache and state of our queries

export default function QueryProvider({ children }: { children: ReactNode }) {
  // prop to provide the client to the application, which is the instance of QueryClient we created
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
