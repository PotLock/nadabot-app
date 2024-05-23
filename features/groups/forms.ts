import { useFormik } from "formik";
import { useCallback } from "react";

import { DIALOGS, useDialogs } from "@nadabot/common/contexts/dialogs";
import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import { useFormErrorLogger } from "@nadabot/common/ui/utils/forms";

import { extractRuleParams, mergeRuleParams } from "./lib";
import { GroupSchema, groupSchema } from "./models";

export type GroupFormParameters = {
  data: GroupExternal;
  onGroupCreate?: VoidFunction;
  onGroupUpdate: (updatedData: GroupExternal) => void;
};

export const useGroupForm = ({
  data,
  onGroupCreate,
  onGroupUpdate,
}: GroupFormParameters) => {
  const isNew = data.id === 0;
  const { openDialog } = useDialogs();

  const { dirty, isSubmitting, isValid, setFieldValue, values, ...form } =
    useFormik<GroupSchema>({
      validationSchema: groupSchema,

      initialValues: {
        ...extractRuleParams(data.rule),
        group_name: data.name,
        providers: data.providers,
      },

      onSubmit: ({ ruleType, ruleThreshold, ...formValues }, actions) => {
        actions.setSubmitting(true);

        const ruleInput = mergeRuleParams({ ruleType, ruleThreshold });

        const txResult = isNew
          ? sybilContract.create_group({ ...formValues, rule: ruleInput })
          : sybilContract.update_group({
              group_id: data.id,

              group_name:
                formValues.group_name !== data.name
                  ? formValues.group_name
                  : undefined,

              providers:
                formValues.providers !== data.providers
                  ? formValues.providers
                  : undefined,

              rule:
                ruleInput !== data.rule ||
                JSON.stringify(data.rule) !== JSON.stringify(ruleInput)
                  ? ruleInput
                  : undefined,
            });

        txResult
          .then(({ id, ...resultData }) => {
            if (isNew) {
              onGroupCreate?.();
            } else {
              onGroupUpdate({ id, ...resultData });

              actions.resetForm({
                values: {
                  ...extractRuleParams(resultData.rule),
                  group_name: resultData.name,
                  providers: resultData.providers,
                },
              });
            }
          })
          .catch((error) => {
            openDialog({
              dialog: DIALOGS.Error,

              props: {
                title: "Error",

                description: JSON.parse(error.message).kind
                  .ExecutionError as string,
              },
            });
          })
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
