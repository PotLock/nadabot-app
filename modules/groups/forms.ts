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
  onCreateSuccess?: VoidFunction;
  onUpdateSuccess: (updatedData: GroupExternal) => void;
};

export const useGroupForm = ({
  data,
  onCreateSuccess,
  onUpdateSuccess,
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

        const rule = mergeRuleParams({ ruleType, ruleThreshold });

        const txResult = isNew
          ? sybilContract.create_group({ ...formValues, rule })
          : sybilContract.update_group({
              group_id: data.id,
              rule,

              group_name:
                formValues.group_name !== data.name
                  ? formValues.group_name
                  : undefined,

              providers:
                formValues.providers !== data.providers
                  ? formValues.providers
                  : undefined,
            });

        txResult
          .then(({ id, ...resultData }) => {
            if (isNew) {
              onCreateSuccess?.();
            } else {
              onUpdateSuccess({ id, ...resultData });

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
