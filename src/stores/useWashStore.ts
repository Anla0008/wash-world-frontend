"use client";

import { create } from "zustand";
import { WashType } from "@/types/singleWashType";
import { Location } from "@/types/locations";

type WashStore = {
  userLocation: string | null;
  userLocationObj: Location | null;
    availibleWashHall: number | null;
    selectedWash: WashType | null;

    startedAt: number | null;
    endedAt: number | null;
    washDate: string | null;

  setUserLocation: (location: string) => void;
  setUserLocationObj: (location: Location) => void;

  setAvailibleWashHall: (hallNumber: number) => void;

  setSelectedWash: (wash: WashType) => void;

  setStartedAt: (time: number) => void;

  setEndedAt: (time: number) => void;

  setWashDate: (date: string) => void;
  
  clearWash: () => void;
};

export const useWashStore = create<WashStore>((set) => ({
  userLocation: null,
  userLocationObj: null,
  availibleWashHall: null,
  selectedWash: null,
  startedAt: null,
  endedAt: null,
  washDate: null,


setUserLocation: (location) =>
    set({
      userLocation: location,
    }),

setUserLocationObj: (location) =>
    set({
      userLocationObj: location,
    }),

  setAvailibleWashHall: (hallNumber) =>
    set({
      availibleWashHall: hallNumber,
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
      availibleWashHall: null,
      startedAt: null,
      endedAt: null,
      washDate: null,
      userLocationObj: null,
    }),
}));