export type WashRoute = "/buyWash" | "/activeWash";

export type WashStep = "buyWash" | "activeWash";

export type WashStepResponse = {
  step: WashStep;
  route: WashRoute;
  progressIndex: number;
  has_sub: boolean;
};