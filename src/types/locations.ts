export type Location = {
  location_pk: string;
  location_name: string;
  location_address: string;
  location_city: string;
  openingHours: string;
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

export type FindCarWashBottomSheetProps = {
  locations: Location[];
  selectedLocationPk: string | null;
  favoriteIds: string[];
};
