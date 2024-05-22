import { InferType, array, number, object, string } from "yup";

import {
  RuleGenericType,
  RuleType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

import {
  GROUP_RULE_TYPES,
  GROUP_RULE_TYPE_DEFAULT,
  GROUP_RULE_TYPE_PARAMS,
} from "./constants";
import { isRuleTypePrimitive } from "./lib";

export const groupSchema = object().shape({
  group_name: string()
    .min(4, "Group name must be at least 4 characters long")
    .required("Group must have a name"),

  providers: array()
    .of(number().required())
    .min(1, "Group must have at least one provider")
    .required(),

  ruleType: string()
    .required()
    .oneOf(GROUP_RULE_TYPES, "Invalid rule type")
    .required("Rule type is required")
    .default(GROUP_RULE_TYPE_DEFAULT),

  ruleThreshold: number().when("ruleType", ([ruleType], schema) =>
    isRuleTypePrimitive(ruleType) || (ruleType as RuleType) === "Sum"
      ? schema.nullable().optional()
      : schema.required(
          `${GROUP_RULE_TYPE_PARAMS[RuleGenericType.IncreasingReturns].title} and
           ${GROUP_RULE_TYPE_PARAMS[RuleGenericType.DiminishingReturns].title}
           rules require threshold`,
        ),
  ),
});

export type GroupSchema = InferType<typeof groupSchema>;

export const groupDefaults = groupSchema.getDefault();
