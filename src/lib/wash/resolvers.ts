import { WashRoute, WashStep } from "@/types/wash";

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

export const resolveProgressSteps = (numbers: string[], activeIndex: number, progress?: number) => {
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