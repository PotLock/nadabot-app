import { useFormik } from "formik";
import { useEffect, useMemo } from "react";

import {
  GroupExternal,
  RuleGenericType,
  RulePrimitiveType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

import {
  GroupSchema,
  groupDefaults,
  groupRuleTypes,
  groupSchema,
} from "./model";

export type GroupFormParameters = {
  data: GroupExternal;
};

export const useGroupForm = ({ data }: GroupFormParameters) => {
  const [ruleType, ruleThreshold] = useMemo((): [
    GroupSchema["rule_type"],
    GroupSchema["rule_threshold"],
  ] => {
    const [unsafeRuleType, threshold] =
      typeof data.rule === "string"
        ? [data.rule]
        : Object.entries(data.rule).at(0) ?? [groupDefaults.rule_type];

    const safeRuleType = groupRuleTypes.includes(
      unsafeRuleType as (typeof groupRuleTypes)[number],
    )
      ? (unsafeRuleType as (typeof groupRuleTypes)[number])
      : groupDefaults.rule_type;

    return [safeRuleType, threshold];
  }, [data.rule]);

  const { dirty, isValid, values, ...form } = useFormik<GroupSchema>({
    validationSchema: groupSchema,

    initialValues: {
      group_name: data.name,
      rule_type: ruleType,
      rule_threshold: ruleThreshold,
      providers: data.providers,
    },

    onSubmit: (formValues) => {
      console.table(formValues);
    },
  });

  const groupRuleTypeOptions = [
    { title: "Highest", value: RulePrimitiveType.Highest },
    { title: "Lowest", value: RulePrimitiveType.Lowest },
    { title: "Sum", value: RuleGenericType.Sum },
    { title: "Booster", value: RuleGenericType.IncreasingReturns },
    { title: "Subtractor", value: RuleGenericType.DiminishingReturns },
  ];

  const isDisabled = !isValid || !dirty;

  const isRulePrimitive =
    values.rule_type === RulePrimitiveType.Highest ||
    values.rule_type === RulePrimitiveType.Lowest;

  useEffect(
    () => Object.values(form.errors).forEach(console.error),
    [form.errors],
  );

  return { ...form, groupRuleTypeOptions, isDisabled, isRulePrimitive, values };
};
