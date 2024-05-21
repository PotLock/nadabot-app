import {
  Rule,
  RulePrimitiveType,
  RuleType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

import { GROUP_RULE_TYPES, GROUP_RULE_TYPE_DEFAULT } from "./constants";

export const isRuleTypePrimitive = (ruleType: RuleType) =>
  ruleType === RulePrimitiveType.Highest ||
  ruleType === RulePrimitiveType.Lowest;

export const extractRuleParams = (
  rule: Rule,
): {
  ruleType: RuleType;
  ruleThreshold?: number;
} => {
  const [likelyRuleType, threshold] =
    typeof rule === "string"
      ? [rule]
      : Object.entries(rule).at(0) ?? [GROUP_RULE_TYPE_DEFAULT];

  return {
    ruleThreshold: threshold ?? undefined,

    ruleType: GROUP_RULE_TYPES.includes(likelyRuleType as RuleType)
      ? (likelyRuleType as RuleType)
      : GROUP_RULE_TYPE_DEFAULT,
  };
};
