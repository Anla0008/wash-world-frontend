"use client";

import { useEffect, useState } from "react";
import { SingleWashType } from "@/types/singleWashType";

export function useSingleWash() {
  const [data, setData] = useState<SingleWashType | null>(null);

  useEffect(() => {
    const getRequest = async () => {

        const response = await fetch("/api/wash/single", {
          cache: "no-store",
        method: "GET",
       
        });

        const json = (await response.json()) as SingleWashType;
        setData(json);
    };

    void getRequest();
  }, []);

  return { data };
}