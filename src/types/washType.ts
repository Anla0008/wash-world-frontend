import { Location } from "./locations";

// ===========================================================
//               GET RUTE TIL STEP
// ==========================================================

export type WashRoute = "/buy-wash" | "/drive-in" | "/error-in-distance";

// ===========================================================
//               GET SUBSCRIPTION STATES
// ==========================================================

export type SubscriptionResponse = {
  has_sub: boolean;
  sub_type: string | null;
};

export type SubscriptionStatus = {
  hasSub: boolean;
  subType: string | null;
};

// ===========================================================
//                 NAVIGATION TIL STEP
// ==========================================================

export type WashStepResponse = {
  route: WashRoute;
  has_sub: boolean;
};

// ===========================================================
//                         VASKEHALLER
// ==========================================================

export type WashingHalls = {
  car_wash_pk: string;
  car_wash_location_fk: string;
  is_broken: boolean;
  car_wash_hall_number: number;
};

// ===========================================================
//                        VENTETID
// ==========================================================

export type WashHallWaitTimeResponse = {
  [hallNumber: string]: number;
};

export type WaitForWashProps = {
  activeIndex: number;
};

export type WaitStatusLabel = "Kort ventetid" | "Moderat ventetid" | "Lang ventetid";

export type WaitTimeHistoryByLocationPk = Record<string, Record<string, number>>;

export type WashHallContextType = {
  waitTimeByLocationPk: Record<string, number>;
  waitTimeHistoryByLocationPk: WaitTimeHistoryByLocationPk;
  waitTime: number;
  waitStatus: WaitStatusLabel;
  ensureWaitTimesForLocations: (locationPks: string[]) => void;
  getWaitTimeForLocation: (locationPk: string) => number;
  getWaitStatusForLocation: (locationPk: string) => WaitStatusLabel;
  refreshWaitTimes: () => void;
}

// ===========================================================
//                    POST VASK TIL BACKEND
// ==========================================================

export type postWash = {
  wash: WashType;
  startedAt: number | null;
  endedAt: number | null;
  availibleWashHall: number | null;
  locationID: string | null;
};

// ===========================================================
//                    TIMER
// ==========================================================

export type TimerProps = {
  totalTime: number;
  onComplete?: () => void;
};

// ===========================================================
//                    VASKE
// ==========================================================

export type WashType = {
  id: string | number;
  name: string;
  sub_title: string;
  description: string;
  is_popular: boolean;
  price_single: number;
  price_subscription: number;
  duration: number;
  checkmarks: string[];
  image: string;
};

// ===========================================================
//                 LISTE OVER ENKELTVASKE
// ==========================================================

export type SingleWashType = {
  types: WashType[];
};

// ===========================================================
//             ZUSTAND STORE FOR VASKEPROCES
// ==========================================================

export type WashStore = {
  locationID: Location["location_pk"];
  locationName: Location["location_name"];
  availibleWashHall: number | null;
  selectedWash: WashType | null;

  startedAt: number | null;
  endedAt: number | null;
  washDate: string | null;

  setLocationID: (locationID: string) => void;
  setLocationName: (locationName: string) => void;

  setAvailibleWashHall: (hallNumber: number) => void;

  setSelectedWash: (wash: WashType | null) => void;

  setStartedAt: (time: number) => void;

  setEndedAt: (time: number) => void;

  setWashDate: (date: string) => void;

  clearWash: () => void;
};

// ===========================================================
//             SINGLEVIEW TIL VASKE
// ==========================================================

export type SingleViewCardProps = {
    wash: WashType;
    isSubscription: boolean;
    onSelect: () => void;
};

// ===========================================================
//                   GEO LOCATION TYPES
// ==========================================================

export type GeoCoords = {
  latitude: number;
  longitude: number;
  source: "gps" | "fallback";
};