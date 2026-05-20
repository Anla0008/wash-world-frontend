
export const washHallState = new Map<
  string,
  {
    occupied: boolean;
    waitTime: number;
    updatedAt: number;
  }
>();