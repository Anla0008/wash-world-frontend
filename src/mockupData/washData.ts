import { GeoCoords } from "@/types/washType";
// ===========================================================
//                MOCKUP REGISTRERING AF BIL I HAL 
// ==========================================================

export const carInWashHall = {
  registered_after_seconds: 5, // 25 sekunder
};

// ===========================================================
//         ENKELT KILDE TIL  VENTETID
// ===========================================================

export const waitTimeData = {
  // Grænser for ventetidskategorier (i sekunder)
  short: {
    max: 6,       // < 2 min
    label: "Kort ventetid",
  },
  moderate: {
    max: 10,       // 2–7 min
    label: "Moderat ventetid",
  },
  long: {
    label: "Lang ventetid", // alt over moderate.max
  },

  // Mock-intervallet skal matche short.max som minimum,
  // så vi kan generere "kort" ventetider
  mockup: {
    min_seconds: 5,          // skal være mindre end short.max for at kunne generere "kort ventetid"
    max_seconds: 15,         // 10 minutter
  },
} as const; // brug as const for at gøre objekterne immutable og bevare de specifikke typer for max og label


export const waitTimeMockup = {
  min_seconds: waitTimeData.mockup.min_seconds,
  max_seconds: waitTimeData.mockup.max_seconds,
};

// ===========================================================
//                 MOCKUP DATA FOR VASKE
// ==========================================================

export const washData = {
  types: [
    {
      id: 1,
      name: "Guld",
      sub_title: "God og effektiv",
      price_single: 59,
      is_popular: false,
      price_subscription: 139,
      duration: 5, // 5 minutter
      description: "God og hurtig bilvask som fjerner det meste løse snavs efterfulgt af en god tørring.",
      checkmarks: [
        "Skumforvask",
        "Aktiv Shampoo",
        "Hjulvask",
        "Højtryksvask",
        "Børstevask",
        "Voks",
        "Tørring"
      ],
      image: "guld-vask.jpg",
    },{
      id: 2,
      name: "Premium",
      sub_title: "Ekstra grundig",
      price_single: 89,
      price_subscription: 169,
      is_popular: true,
      duration: 10, // 8 minutter
      description: "Særdeles god og grundig bilvask som fjerner alt løst snavs efterfulgt af en god tørring.",
      checkmarks: [
        "Skumforvask",
        "Aktiv Shampoo",
        "Hjulvask",
        "Højtryksvask",
        "Børstevask",
        "Voks",
        "Tørring",
        "Højglans",
        "Undervognsvask"
      ],
      image: "premium-vask.jpg",
    },{
      id: 3,
      name: "Brilliant",
      sub_title: "Bedste vask året rundt",
      price_single: 119,
      price_subscription: 199,
      is_popular: false,
      description: "Luksus bilvask med Brilliant som giver dig en skinnende ren bil med alt du behøver og mere til efterfulgt af ekstra tørring",
      duration: 15, // 10 minutter
      checkmarks: [
        "Skumforvask",
        "Aktiv Shampoo",
        "Hjulvask",
        "Højtryksvask",
        "Børstevask",
        "Voks",
        "Tørring",
        "Højglans",
        "Undervognsvask",
        "Skumvask",
        "Affedtning",
        "Sæsonrens"
      ],
      image: "brilliant-vask.jpg",
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
    updatedAt: number;
    entryCreatedAt: number | null;
    registeredAfterSeconds: number;
  }
>();

// ===========================================================
//         DEFAULT FALLBACK IN CASE OF GPS FAILURE
// ===========================================================

export const fallbackCords: GeoCoords = {
  latitude: 55.6761, // København fallback
  longitude: 12.5683,
  source: "fallback",
};