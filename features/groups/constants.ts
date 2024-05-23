import {
  RuleGenericType,
  RulePrimitiveType,
  RuleType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

export const GROUP_RULE_TYPE_DEFAULT = RulePrimitiveType.Highest;

export const GROUP_RULE_TYPES: RuleType[] = [
  ...Object.values(RulePrimitiveType),
  ...Object.values(RuleGenericType),
];

export const GROUP_RULE_TYPE_PARAMS: Record<
  RuleType,
  {
    title: string;

    thresholdToDescription:
      | ((threshold?: number | null) => string)
      | ((threshold: number) => string);

    color?: string;
    value: RuleType;
  }
> = {
  [RulePrimitiveType.Highest]: {
    title: "Highest",
    thresholdToDescription: () => "Takes the highest score from the group.",
    color: "#BAEC6A",
    value: RulePrimitiveType.Highest,
  },

  [RulePrimitiveType.Lowest]: {
    title: "Lowest",
    thresholdToDescription: () => "Takes the lowest score from the group.",
    color: "#CFC2B4",
    value: RulePrimitiveType.Lowest,
  },

  [RuleGenericType.Sum]: {
    title: "Sum",

    thresholdToDescription: (threshold?: number | null) =>
      typeof threshold === "number"
        ? `Total score for the group, up to ${threshold} points`
        : "Total score for the group.",

    color: "#C4B4FE",
    value: RuleGenericType.Sum,
  },

  [RuleGenericType.IncreasingReturns]: {
    title: "Booster",

    thresholdToDescription: (threshold: number) =>
      `Total amount of points is increased by ${threshold}% for every check inside the group.`,

    color: "#F0CF1F",
    value: RuleGenericType.IncreasingReturns,
  },

  [RuleGenericType.DiminishingReturns]: {
    title: "Subtractor",

    thresholdToDescription: (threshold: number) =>
      `Total amount of points is reduced by ${threshold}% for every check inside the group.`,

    color: "#FAA7A8",
    value: RuleGenericType.DiminishingReturns,
  },
};
