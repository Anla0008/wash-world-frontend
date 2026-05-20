import { create } from "zustand";
import { SetStateAction } from "react";

type Range = {
  min: number;
  max: number;
};

type LocationFilterStore = {
  searchTerm: string;

  washHallRange: Range;
  selfWashRange: Range;

  selectedFacilities: string[];

  setSearchTerm: (value: string) => void;

  setWashHallRange: (value: SetStateAction<Range>) => void;
  setSelfWashRange: (value: SetStateAction<Range>) => void;

  toggleFacility: (facility: string) => void;
  resetFilters: (maxWashHallNumber?: number, minSelfWashNumber?: number, maxSelfWashNumber?: number) => void;
};

export const useLocationFilterStore = create<LocationFilterStore>((set) => ({
  searchTerm: "",

  washHallRange: {
    min: 1,
    max: 1,
  },

  selfWashRange: {
    min: 1,
    max: 1,
  },

  selectedFacilities: [],

  setSearchTerm: (value) => {
    set({ searchTerm: value });
  },

  setWashHallRange: (value) => {
    set((state) => ({
      washHallRange: typeof value === "function" ? value(state.washHallRange) : value,
    }));
  },

  setSelfWashRange: (value) => {
    set((state) => ({
      selfWashRange: typeof value === "function" ? value(state.selfWashRange) : value,
    }));
  },

  toggleFacility: (facility) => {
    set((state) => ({
      selectedFacilities: state.selectedFacilities.includes(facility) ? state.selectedFacilities.filter((item) => item !== facility) : [...state.selectedFacilities, facility],
    }));
  },

  resetFilters: (maxWashHallNumber = 1, minSelfWashNumber = 0, maxSelfWashNumber = 0) => {
    set({
      searchTerm: "",
      washHallRange: {
        min: 1,
        max: maxWashHallNumber,
      },
      selfWashRange: {
        min: minSelfWashNumber,
        max: maxSelfWashNumber,
      },
      selectedFacilities: [],
    });
  },
}));
