import { useFormik } from "formik";
import { useCallback } from "react";

import { useFormErrorLogger } from "@nadabot/common/lib/form";
import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import {
  GroupExternal,
  Rule,
  RuleGenericType,
  RulePrimitiveType,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

import { extractRuleParams, isRuleTypePrimitive } from "./lib";
import { GroupSchema, groupSchema } from "./model";

export type GroupFormParameters = {
  data: GroupExternal;
  onGroupCreate?: VoidFunction;
};

export const useGroupForm = ({ data, onGroupCreate }: GroupFormParameters) => {
  const { dirty, isSubmitting, isValid, setFieldValue, values, ...form } =
    useFormik<GroupSchema>({
      validationSchema: groupSchema,

      initialValues: {
        ...extractRuleParams(data.rule),
        group_name: data.name,
        providers: data.providers,
      },

      onSubmit: ({ ruleType, ruleThreshold, ...formValues }, actions) => {
        console.table({ ruleType, ruleThreshold, ...formValues });

        actions.setSubmitting(true);

        sybilContract
          .add_or_update_group({
            ...formValues,

            rule: isRuleTypePrimitive(ruleType)
              ? (ruleType as RulePrimitiveType)
              : ({
                  [ruleType as keyof typeof RuleGenericType]: ruleThreshold,
                } as Rule),
          })
          .then(({ id, name, providers, rule }) => {
            if (id === data.id) {
              actions.setValues({
                ...extractRuleParams(rule),
                group_name: name,
                providers,
              });
            } else onGroupCreate?.();
          })
          .catch(console.error)
          .finally(() => actions.setSubmitting(false));
      },
    });

  const providerSelectHandler = useCallback(
    (id: ProviderId) => () =>
      setFieldValue(
        "providers",

        values.providers.includes(id)
          ? values.providers.filter((targetId) => targetId !== id)
          : [...values.providers, id],
      ),

    [setFieldValue, values.providers],
  );

  const isDisabled = !isValid || !dirty || isSubmitting;

  useFormErrorLogger(form.errors);

  return { ...form, isDisabled, isSubmitting, providerSelectHandler, values };
};
