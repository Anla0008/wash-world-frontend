"use client";

import { create } from "zustand";
import { WashStore } from "@/types/washType";

export const useWashStore = create<WashStore>((set) => ({

  // initial state for wash store
  locationID: "undefined",
  locationName: "undefined",
  availibleWashHall: null,
  selectedWash: null,
  hasSub: false,
  subType: null,
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

  setSubscription: (hasSub, subType) =>
    set({
      hasSub,
      subType,
    }),

  hydrateSubscription: async () => {
    try {
      const response = await fetch("http://127.0.0.1:80/subscription/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        set({ hasSub: false, subType: null });
        return;
      }

      const data = await response.json();

      set({
        hasSub: Boolean(data.has_sub),
        subType: data.sub_type ?? null,
      });
    } catch {
      set({ hasSub: false, subType: null });
    }
  },

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
      hasSub: false,
      subType: null,
      locationID: undefined,
      locationName: undefined,
    }),
}));