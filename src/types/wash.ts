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
