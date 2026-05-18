// resolvers bruges til at simulerer logikken i vores API, så vi kan teste forskellige scenarier og holde vores komponenter rene for logik
import { WashRoute, WashStep } from "@/types/wash";
import { WashHallWaitTimeResponse } from "@/types/washHallWaitTimeType";

  // ===========================================================
  //  BESTEM RUTE EFTER SUBSCRIPTION (SIMULERET)
  // ===========================================================
export const resolveRoute = (hasSub: boolean): WashRoute => {
  return hasSub ? "/activeWash" : "/buyWash";
};

  // ===========================================================
  //              BESTEM STEP EFTER RUTE (SIMULERET)
  // ===========================================================

export const resolveStep = (route: WashRoute): WashStep => {
  return route === "/activeWash"
    ? "activeWash"
    : "buyWash";
};

  // ===========================================================
  //      DEFINER PROGRESSINDEX FOR HVER ROUTE (progressbar)
  // ===========================================================

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

  // ===========================================================
  //    UDREGN WIDTH TIL NÆSTE STEP FOR PROGRESSBAR
  // ===========================================================

export const resolveProgressSteps = (numbers: string[], activeIndex: number, progress?: number) => { //numbers: string fordi det er det format vi får fra API'et
  // total antal steps, baseret på numre i arrayet
    const totalSteps = numbers.length;

    // Beregn den grundlæggende progress baseret på aktive steps
    const stepProgressWidth =
      totalSteps > 1 ? ((activeIndex - 1) / (totalSteps - 1)) * 100 : 0;

    // Beregn bredden af hvert segment mellem steps
      const segmentWidth = 100 / (totalSteps - 1);
      
    // Beregn startpunktet for det nuværende segment
      const currentSegmentStart = (activeIndex - 1) * segmentWidth;

    // Beregn den endelige progress ved at tilføje den procentvise progress inden for det nuværende segment
      const clampedProgress =
        progress !== undefined
          ? currentSegmentStart + (progress / 100) * segmentWidth
          : stepProgressWidth;

  return clampedProgress;
}

  // ===========================================================
  //                 SIMULER LEDIG VASKEHAL
  // ==========================================================

  export const generateAvailibleWashHalls = (): string => {

    const washHalls = ["1", "2", "3"]; // TODO: erstat med vaskehaller, brugeren er tættest på
    const randomIndex = Math.floor(Math.random() * washHalls.length); // Vælg tilfældigt index

    return washHalls[randomIndex]; 
  }

// ===========================================================
//            RESOLVE RANDOM WAIT TIME
// ===========================================================
export const resolveWaitTime = (
  waitTime: WashHallWaitTimeResponse
): number => {
  const { wait_time_seconds_min: min, wait_time_seconds_max: max } = waitTime;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
