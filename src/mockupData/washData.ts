import { GeoCoords } from "@/types/washType";
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

export const washData = {
  types: [
    {
      id: 1,
      name: "Guld",
      sub_title: "God og effektiv",
      price_single: 59,
      is_popular: false,
      price_subscription: 139,
      duration: 300, // 5 minutter
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
      duration: 480, // 8 minutter
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
      duration: 600, // 10 minutter
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
    waitTime: number;
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