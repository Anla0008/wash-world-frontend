// ===========================================================
//                MOCKUP REGISTRERING AF BIL I HAL 
// ==========================================================

export const carInWashHall = {
  registered_after_seconds: 25, // 25 sekunder
};

// ===========================================================
//              MOCKUP FOR VENTETID I HAL
// ==========================================================

 const washHallRandomizer = {
  1: Math.floor(Math.random() * 60), // op til 1 min
  2: Math.floor(Math.random() * 300), // op til 5 min
  3: Math.floor(Math.random() * 600), // op til 10 min
};

export const washHallWaitTime: { [key: number]: number } = {
    1: washHallRandomizer[1],
    2: washHallRandomizer[2],
    3: washHallRandomizer[3],
};

// ===========================================================
//                 MOCKUP DATA FOR ENKELTVASKE
// ==========================================================

export const singleWashData = {
  types: [
    {
      id: 1,
      name: "Guld",
      description: "God og effektiv",
      price: 59,
      duration: 300, // 5 minutter
    },{
      id: 2,
      name: "Premium",
      description: "Ekstra grundig",
      price: 89,
      duration: 480, // 8 minutter
    },{
      id: 3,
      name: "Brilliant",
      description: "Bedste vask året rundt",
      price: 119,
      duration: 600 // 10 minutter
    }
  ]
};

// ===========================================================
//               MAP OVER HALLS OG DERES STATUS
// ===========================================================

export const washHallState = new Map<
  string,
  {
    occupied: boolean;
    waitTime: number;
    updatedAt: number;
    entryCreatedAt: number | null;
    registeredAfterSeconds: number;
  }
>();