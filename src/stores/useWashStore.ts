"use client";

import { create } from "zustand";
import { WashType } from "@/types/singleWashType";

type WashStore = {
  selectedWash: WashType | null;

  startedAt: number | null;
  endedAt: number | null;
washDate: string | null;

  setSelectedWash: (wash: WashType) => void;

  setStartedAt: (time: number) => void;

  setEndedAt: (time: number) => void;

  setWashDate: (date: string) => void;

  clearWash: () => void;
};

export const useWashStore = create<WashStore>((set) => ({
  selectedWash: null,
  startedAt: null,
endedAt: null,
  washDate: null,

  setSelectedWash: (wash) =>
    set({
      selectedWash: wash,
    }),

    setWashDate: (date) =>
    set({
      washDate: date,
    }), 

  setStartedAt: (time) =>
    set({
      startedAt: time,
    }),

    setEndedAt: (time) =>
  set((state) => ({
    endedAt:
      time +
      ((state.selectedWash?.duration ?? 0) * 1000),
  })),

  clearWash: () =>
    set({
      selectedWash: null,
      startedAt: null,
      endedAt: null,
      washDate: null,
    }),
}));