"use client";

import { create } from "zustand";
import { WashStore } from "@/types/washType";

export const useWashStore = create<WashStore>((set) => ({

  // initial state for wash store
  locationID: "undefined",
  locationName: "undefined",
  availibleWashHall: null,
  selectedWash: null,
  startedAt: null,
  endedAt: null,
  washDate: null,

// set alle state funktioner til at opdatere den relevante del af state i zustand store
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

  // nulstil for at forberede til næste vask
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