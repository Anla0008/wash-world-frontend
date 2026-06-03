import { waitTimeMockup } from "@/mockupData/washData";

export type WaitStatusLabel = "Kort ventetid" | "Moderat ventetid" | "Lang ventetid";

export const resolveWaitStatusLabel = (waitTimeSeconds: number): WaitStatusLabel => {
  if (waitTimeSeconds > 300) return "Lang ventetid";
  if (waitTimeSeconds > 120) return "Moderat ventetid";
  return "Kort ventetid";
};

const createRandomInRange = (minSeconds: number, maxSeconds: number): number => {
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
};

const waitStatusSecondRanges = [
  { min: waitTimeMockup.min_seconds, max: 120 },
  { min: 121, max: 300 },
  { min: 301, max: waitTimeMockup.max_seconds },
] as const;

export const createDiversifiedWaitTimesByLocation = (locationPks: string[]): Record<string, number> => {
  return locationPks.reduce<Record<string, number>>((acc, locationPk, index) => {
    const selectedRange = waitStatusSecondRanges[index % waitStatusSecondRanges.length];
    acc[locationPk] = createRandomInRange(selectedRange.min, selectedRange.max);
    return acc;
  }, {});
};