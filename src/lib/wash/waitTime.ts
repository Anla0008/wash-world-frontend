import { waitTimeMockup } from "@/mockupData/washData";
import { WaitStatusLabel } from "@/types/washType";

/////////////////////////////////////////////////////////
// GENERATE LABEL FOR WAITTIME //
/////////////////////////////////////////////////////////
export const resolveWaitStatusLabel = (waitTimeSeconds: number): WaitStatusLabel => {
  if (waitTimeSeconds > 300) return "Lang ventetid";
  if (waitTimeSeconds > 120) return "Moderat ventetid";
  return "Kort ventetid";
};

/////////////////////////////////////////////////////////
// GENERATE RANDOM WAITTIME //
/////////////////////////////////////////////////////////
const createRandomInRange = (minSeconds: number, maxSeconds: number): number => {
  // hent max og min sec fra waitTimeMockup, og generer et random tal i det interval
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
};

/////////////////////////////////////////////////////////
// GENERATE DIVERSIFIED WAITTIME SECONDS//
/////////////////////////////////////////////////////////
const waitStatusSecondRanges = [
  // interval for "Kort ventetid" - fra min_seconds til 120 sekunder
  { min: waitTimeMockup.min_seconds, max: 120 },
  // interval for "Moderat ventetid" - fra 121 sekunder til 300 sekunder
  { min: 121, max: 300 },
  // interval for "Lang ventetid" - fra 301 sekunder til max_seconds
  { min: 301, max: waitTimeMockup.max_seconds },
] as const; // returner som tuple, så vi bevarer de specifikke typer for min og max i hvert objekt

// bruges til at reset ventetiderne for hver locationPk
/////////////////////////////////////////////////////////
// GENERATE WAITTIMES BAED ON LOCATION_PK //
/////////////////////////////////////////////////////////
export const createDiversifiedWaitTimesByLocation = (locationPks: string[]): Record<string, number> => {
  return locationPks.reduce<Record<string, number>>((acc, locationPk, index) => {
    // KILDE: https://stackoverflow.com/questions/31106189/how-to-cycle-through-an-array-in-javascript-using-modulo
    // vælg det relevante interval baseret på index, og brug modulo for at sikre, at vi cykler gennem intervallerne, hvis der er flere locationPks end intervaller
    const selectedRange = waitStatusSecondRanges[index % waitStatusSecondRanges.length];

    // accumulér ventetiden for hver locationPk ved at generere et random tal inden for det valgte interval
    acc[locationPk] = createRandomInRange(selectedRange.min, selectedRange.max);

    return acc;
  }, {});
};

// bruges til at føje nye lokationer ind uden at ødelægge eksisterende fordeling
/////////////////////////////////////////////////////////
// GENERATE WAITTIMES BASED ON LOCATION_PK WITH OFFSET //
/////////////////////////////////////////////////////////
export const createDiversifiedWaitTimesByLocationWithOffset = (locationPks: string[], offset: number): Record<string, number> => {
  // offset bruges til at starte fordelingen af ventetider ved et andet punkt i waitStatusSecondRanges, så vi får en mere varieret fordeling af ventetiderne, selvom locationPks altid kommer i samme rækkefølge
  return locationPks.reduce<Record<string, number>>((acc, locationPk, index) => {
    const selectedRange = waitStatusSecondRanges[(offset + index) % waitStatusSecondRanges.length];

    acc[locationPk] = createRandomInRange(selectedRange.min, selectedRange.max);

    return acc;
  }, {});
};
