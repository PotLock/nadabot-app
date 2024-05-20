import { InferType, array, number, object, string } from "yup";

import {
  RuleGenericType,
  RulePrimitiveType,
  RuleType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

export const groupRuleTypes: RuleType[] = [
  ...Object.values(RulePrimitiveType),
  ...Object.values(RuleGenericType),
];

export const groupSchema = object().shape({
  group_name: string()
    .min(4, "Group name must be at least 4 characters long")
    .required("Group must have a name"),

  providers: array()
    .of(number().required())
    .min(1, "Group must have at least one provider")
    .required(),

  rule_type: string()
    .required()
    .oneOf(groupRuleTypes)
    .required("Rule type is required")
    .default(RulePrimitiveType.Highest),

  rule_threshold: number().nullable().optional(),
});

export type GroupSchema = InferType<typeof groupSchema>;

export const groupDefaults = groupSchema.getDefault();
