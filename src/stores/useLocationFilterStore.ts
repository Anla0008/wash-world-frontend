import { create } from "zustand";
import { SetStateAction } from "react";

// Et interval med en min og max værdi
type Range = {
  min: number;
  max: number;
};

// Beskriver hvad vores "store" indeholder og kan gøre
type LocationFilterStore = {
  // ===========================================================
  //                         DATA
  // ===========================================================
  searchTerm: string; // hvad brugeren har skrevet i søgefeltet
  washHallRange: Range; // interval for antal vaskehaller
  selfWashRange: Range; // interval for antal selvvask
  selectedFacilities: string[]; // de faciliteter brugeren har valgt

  // ===========================================================
  //                       FUNKTIONER   ← TYPE-DEFINITIONEN
  // ===========================================================
  setSearchTerm: (value: string) => void;
  setWashHallRange: (value: SetStateAction<Range>) => void;
  setSelfWashRange: (value: SetStateAction<Range>) => void;
  toggleFacility: (facility: string) => void;
  resetFilters: (maxWashHallNumber?: number, minSelfWashNumber?: number, maxSelfWashNumber?: number) => void;
};

export const useLocationFilterStore = create<LocationFilterStore>((set) => ({
  // ===========================================================
  //                      STARTVÆRDIER
  // ===========================================================
  searchTerm: "",
  washHallRange: { min: 1, max: 1 },
  selfWashRange: { min: 1, max: 1 },
  selectedFacilities: [],

  // ===========================================================
  //                       FUNKTIONER   ← SELVE KODEN
  // ===========================================================

  // Opdaterer søgeteksten
  setSearchTerm: (value) => {
    set({ searchTerm: value });
  },

  // Opdaterer vaskehal-intervallet
  setWashHallRange: (value) => {
    set((state) => ({
      washHallRange: typeof value === "function" ? value(state.washHallRange) : value,
    }));
  },

  // Opdaterer selvvask-intervallet
  setSelfWashRange: (value) => {
    set((state) => ({
      selfWashRange: typeof value === "function" ? value(state.selfWashRange) : value,
    }));
  },

  // Tilføjer eller fjerner en facilitet
  // Hvis den allerede er valgt → fjern den
  // Hvis den ikke er valgt    → tilføj den
  toggleFacility: (facility) => {
    set((state) => ({
      selectedFacilities: state.selectedFacilities.includes(facility) ? state.selectedFacilities.filter((item) => item !== facility) : [...state.selectedFacilities, facility],
    }));
  },

  // Nulstiller alle filtre tilbage til deres standardværdier
  resetFilters: (maxWashHallNumber = 1, minSelfWashNumber = 0, maxSelfWashNumber = 0) => {
    set({
      searchTerm: "",
      washHallRange: { min: 1, max: maxWashHallNumber },
      selfWashRange: { min: minSelfWashNumber, max: maxSelfWashNumber },
      selectedFacilities: [],
    });
  },
}));
