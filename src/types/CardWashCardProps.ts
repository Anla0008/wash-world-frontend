export type CardWashCardProps = {
  location_pk: string;
  city: string;
  address: string;
  openingHours: string;
  image: string;
  href: string;
  isFavorite?: boolean;
  onRemove?: () => void;
  waitTimeSeconds: number;
};
