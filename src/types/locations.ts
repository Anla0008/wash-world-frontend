export type Location = {
  location_pk: string;
  location_name: string;
  location_address: string;
  location_city: string;
  opening_hours?: string;
  openingHours?: string;
  location_opening_hours?: string;
  open_from?: string;
  open_to?: string;
  car_wash_hall_number?: number;
  car_wash_text?: string;
  car_wash_high_pressure?: number;
  car_wash_self?: number;
  car_wash_vacuum?: number;
  location_img: string;
  location_lat?: number;
  location_lng?: number;
  is_broken?: boolean;
};

export type WaitStatus = "Kort ventetid" | "Moderat ventetid" | "Lang ventetid";

export type FindCarWashBottomSheetProps = {
  locations: Location[];
  selectedLocationPk: string | null;
  favoriteIds: string[];
};
