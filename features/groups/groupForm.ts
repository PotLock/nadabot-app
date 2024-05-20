import { useFormik } from "formik";
import { useEffect, useMemo } from "react";

import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

import { GroupSchema, groupDefaults, groupSchema } from "./model";

export type GroupFormParameters = {
  data: GroupExternal;
};

export const useGroupForm = ({ data }: GroupFormParameters) => {
  const [ruleType, ruleThreshold] = useMemo(() => {
    const [unsafeType, threshold] =
      typeof data.rule === "string"
        ? [data.rule]
        : Object.entries(data.rule).at(0) ?? [groupDefaults.rule_type];

    const safeType: GroupSchema["rule_type"] =
      unsafeType === "Highest" ||
      unsafeType === "Lowest" ||
      unsafeType === "Sum" ||
      unsafeType === "DiminishingReturns" ||
      unsafeType === "IncreasingReturns"
        ? unsafeType
        : groupDefaults.rule_type;

    return [safeType, threshold];
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

  const isDisabled = !isValid || !dirty;

  const isRulePrimitive =
    values.rule_type === "Highest" || values.rule_type === "Lowest";

  useEffect(
    () => Object.values(form.errors).forEach(console.error),
    [form.errors],
  );

  return { ...form, isDisabled, isRulePrimitive, values };
};
