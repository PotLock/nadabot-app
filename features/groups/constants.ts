import {
  RuleGenericType,
  RulePrimitiveType,
  RuleType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

export const GROUP_RULE_TYPES: RuleType[] = [
  ...Object.values(RulePrimitiveType),
  ...Object.values(RuleGenericType),
];

export const GROUP_RULE_TYPE_PARAMS = {
  [RulePrimitiveType.Highest]: {
    title: "Highest",
    value: RulePrimitiveType.Highest,
  },

  [RulePrimitiveType.Lowest]: {
    title: "Lowest",
    value: RulePrimitiveType.Lowest,
  },

  [RuleGenericType.Sum]: {
    title: "Sum",
    value: RuleGenericType.Sum,
  },

  [RuleGenericType.IncreasingReturns]: {
    title: "Booster",
    value: RuleGenericType.IncreasingReturns,
  },

  [RuleGenericType.DiminishingReturns]: {
    title: "Subtractor",
    value: RuleGenericType.DiminishingReturns,
  },
};

export const GROUP_RULE_TYPE_DEFAULT = RulePrimitiveType.Highest;
