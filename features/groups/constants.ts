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
  { title: string; color?: string; value: RuleType }
> = {
  [RulePrimitiveType.Highest]: {
    title: "Highest",
    color: "#BAEC6A",
    value: RulePrimitiveType.Highest,
  },

  [RulePrimitiveType.Lowest]: {
    title: "Lowest",
    color: "#CFC2B4",
    value: RulePrimitiveType.Lowest,
  },

  [RuleGenericType.Sum]: {
    title: "Sum",
    color: "#C4B4FE",
    value: RuleGenericType.Sum,
  },

  [RuleGenericType.IncreasingReturns]: {
    title: "Booster",
    color: "#F0CF1F",
    value: RuleGenericType.IncreasingReturns,
  },

  [RuleGenericType.DiminishingReturns]: {
    title: "Subtractor",
    color: "#FAA7A8",
    value: RuleGenericType.DiminishingReturns,
  },
};
