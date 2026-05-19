"use client";

import { create } from "zustand";
import { WashType } from "@/types/singleWashType";

type WashStore = {
    userLocation: string | null;

  selectedWash: WashType | null;

  startedAt: number | null;
  endedAt: number | null;
    washDate: string | null;

setUserLocation: (location: string) => void;

  setSelectedWash: (wash: WashType) => void;

  setStartedAt: (time: number) => void;

  setEndedAt: (time: number) => void;

  setWashDate: (date: string) => void;
  
  clearWash: () => void;
};

export const useWashStore = create<WashStore>((set) => ({
userLocation: null,
  selectedWash: null,
  startedAt: null,
endedAt: null,
  washDate: null,

setUserLocation: (location) =>
    set({
      userLocation: location,
    }),

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