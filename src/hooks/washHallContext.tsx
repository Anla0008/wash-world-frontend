"use client";
import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { createRandomWaitTimeSeconds } from "@/mockupData/washData";
import { resolveWaitStatusLabel, WaitStatusLabel } from "@/lib/wash/waitTime";

interface WashHallContextType {
  waitTime: number;
  waitStatus: WaitStatusLabel;
  refreshWaitTime: () => void;
}

const WashHallContext = createContext<WashHallContextType | undefined>(undefined);

export const WashHallProvider = ({ children }: { children: ReactNode }) => {
  const [waitTime, setWaitTime] = useState<number>(() => createRandomWaitTimeSeconds());

  // useMemo for at undgå unødvendige beregninger af waitStatus ved hver render, da det kun skal opdateres når waitTime ændres
  const waitStatus = useMemo(() => resolveWaitStatusLabel(waitTime), [waitTime]);

  // opdater ventetid 
  const refreshWaitTime = () => {
    setWaitTime(createRandomWaitTimeSeconds());
  };

  return (
    <WashHallContext.Provider value={{ waitTime, waitStatus, refreshWaitTime }}>
      {children}
    </WashHallContext.Provider>
  );
};

// kilde: https://react.dev/reference/react/useContext#example-using-context-to-share-global-data
export const useWashHall = () => {
  // sikre at hook kun bruges inden for provider
  const ctx = useContext(WashHallContext);
  // hvis ctx er undefined, betyder det at hook bruges uden for provider, så kast en fejl
  if (!ctx) throw new Error("useWashHall must be used inside WashHallProvider");
  return ctx;
};