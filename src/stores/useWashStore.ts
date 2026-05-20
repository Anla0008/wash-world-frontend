"use client";

import { create } from "zustand";
import { WashType } from "@/types/singleWashType";
import { Location } from "@/types/locations";
type WashStore = {
  locationID: Location["location_pk"];
  locationName: Location["location_name"];
    availibleWashHall: number | null;
    selectedWash: WashType | null;

    startedAt: number | null;
    endedAt: number | null;
    washDate: string | null;

  setLocationID: (locationID: string) => void;
  setLocationName: (locationName: string) => void;

  setAvailibleWashHall: (hallNumber: number) => void;

  setSelectedWash: (wash: WashType) => void;

  setStartedAt: (time: number) => void;

  setEndedAt: (time: number) => void;

  setWashDate: (date: string) => void;
  
  clearWash: () => void;
};

export const useWashStore = create<WashStore>((set) => ({
  locationID: "undefined",
  locationName: "undefined",
  availibleWashHall: null,
  selectedWash: null,
  startedAt: null,
  endedAt: null,
  washDate: null,


setLocationID: (locationID) =>
    set({
      locationID: locationID  ,
    }),

setLocationName: (locationName) =>
    set({
      locationName: locationName,
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
      locationID: undefined,
      locationName: undefined,
    }),
}));