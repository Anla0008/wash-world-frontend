export type WashRoute = "/buyWash" | "/activeWash" | "/errorInDistance";

export type WashStep = "buyWash" | "activeWash";

export type WashStepResponse = {
  step: WashStep;
  route: WashRoute;
  has_sub: boolean;
};

export type WashingHalls = {
  car_wash_pk: string;
  car_wash_location_fk: string;
  is_broken: boolean;
  car_wash_hall_number: number;
};