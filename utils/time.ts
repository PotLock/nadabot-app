import { Temporal } from "temporal-polyfill";

export const millisecondsToDays = (
  value: Temporal.DurationLike["milliseconds"] | string | null,
) => {
  try {
    return Temporal.Duration.from({
      milliseconds: typeof value === "string" ? parseInt(value) : value ?? 0,
    }).total("days");
  } catch {
    const error = new TypeError(`Unable to convert \`${value}\` to days`);

    console.error(error);
    throw error;
  }
};

export const daysToMilliseconds = (
  value: Temporal.DurationLike["days"] | string | null,
) => {
  try {
    return Temporal.Duration.from({
      days: typeof value === "string" ? parseInt(value) : value ?? 0,
    }).total("milliseconds");
  } catch {
    const error = new TypeError(
      `Unable to convert \`${value}\` to milliseconds`,
    );

    console.error(error);
    throw error;
  }
};
