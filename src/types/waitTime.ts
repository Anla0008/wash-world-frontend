export type WashHallRuntimeState = {
  occupied: boolean;
  broken: boolean;
  carsInQueue: number;
  waitTime: number;
  updatedAt: number;
  entryCreatedAt: number | null;
  registeredAfterSeconds: number;
};