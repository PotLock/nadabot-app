import {
  Rule,
  RuleGenericType,
  RulePrimitiveType,
  RuleType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

import { GROUP_RULE_TYPES, GROUP_RULE_TYPE_DEFAULT } from "./constants";

export const isRuleTypePrimitive = (ruleType: RuleType) =>
  ruleType === RulePrimitiveType.Highest ||
  ruleType === RulePrimitiveType.Lowest;

type RuleParams = { ruleType: RuleType; ruleThreshold?: number };

export const extractRuleParams = (rule: Rule): RuleParams => {
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

export const mergeRuleParams = ({
  ruleType,
  ruleThreshold,
}: RuleParams): Rule =>
  isRuleTypePrimitive(ruleType)
    ? (ruleType as RulePrimitiveType)
    : ({ [ruleType as keyof typeof RuleGenericType]: ruleThreshold } as Rule);
