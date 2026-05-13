import { WashRoute, WashStep } from "@/types/wash";

export const resolveRoute = (hasSub: boolean): WashRoute => {
  return hasSub ? "/activeWash" : "/buyWash";
};

export const resolveStep = (route: WashRoute): WashStep => {
  return route === "/activeWash"
    ? "activeWash"
    : "buyWash";
};

export const resolveProgressIndex = (
  route: WashRoute
): number => {
  switch (route) {
    case "/buyWash":
      return 1;

    case "/activeWash":
      return 2;

    default:
      return 0;
  }
};