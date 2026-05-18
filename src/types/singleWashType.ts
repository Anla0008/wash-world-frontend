export type WashType = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

export type SingleWashType = {
  types: WashType[];
};

export type WashStore = {
  selectedWash: WashType | null;

  setSelectedWash: (wash: WashType) => void;
};