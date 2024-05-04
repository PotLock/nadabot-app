import { Temporal } from "temporal-polyfill";

export const millisecondsToDays = (milliseconds: number | null) =>
  typeof milliseconds === "number"
    ? Temporal.Duration.from({ milliseconds }).total("days")
    : 0;

export const daysToMilliseconds = (days: number | null) =>
  typeof days === "number"
    ? Temporal.Duration.from({ days }).total("milliseconds")
    : 0;
