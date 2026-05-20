import { WashType } from "./singleWashType";
export type postWash = {
    wash: WashType;
    startedAt: number | null;
    endedAt: number | null;
    availibleWashHall: number | null;
    locationID: string | null;
}