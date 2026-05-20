"use client";

import { create } from "zustand";
import { WashStore } from "@/types/wash";

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