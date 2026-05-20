import { Location } from "./locations";
export type WashRoute = "/buyWash" | "/activeWash" | "/errorInDistance";

export type WashStep = "buyWash" | "activeWash";

  // ===========================================================
  //                 NAVIGATION TIL STEP
  // ==========================================================

export type WashStepResponse = {
  step: WashStep;
  route: WashRoute;
  has_sub: boolean;
};

  // ===========================================================
  //                         VASKEHALLER
  // ==========================================================

export type WashingHalls = {
  car_wash_pk: string;
  car_wash_location_fk: string;
  is_broken: boolean;
  car_wash_hall_number: number;
};

  // ===========================================================
  //                        VENTETID
  // ==========================================================

export type WashHallWaitTimeResponse = {
  wait_time_seconds_min: number;
  wait_time_seconds_max: number;
};

export type WaitForWashProps = {
  activeIndex: number;
};

  // ===========================================================
  //                    POST VASK TIL BACKEND
  // ==========================================================


export type postWash = {
    wash: WashType;
    startedAt: number | null;
    endedAt: number | null;
    availibleWashHall: number | null;
    locationID: string | null;
}

  // ===========================================================
  //                    TIMER
  // ==========================================================

export type TimerProps = {
  totalTime: number;
  onComplete?: () => void;
};

  // ===========================================================
  //                    ENKELTVASKE
  // ==========================================================

export type WashType = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

  // ===========================================================
  //                 LISTE OVER ENKELTVASKE
  // ==========================================================

export type SingleWashType = {
  types: WashType[];
};


  // ===========================================================
  //             ZUSTAND STORE FOR VASKEPROCES
  // ==========================================================

export type WashStore = {
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