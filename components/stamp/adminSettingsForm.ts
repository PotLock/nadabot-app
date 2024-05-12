import { FormikHelpers, useFormik } from "formik";
import { useCallback, useState } from "react";

import { useProviders } from "@nadabot/hooks/store/useProviders";
import * as sybilContract from "@nadabot/services/contracts/sybil.nadabot";
import {
  ProviderExternal,
  UpdateProviderInput,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import { daysToMilliseconds, millisecondsToDays } from "@nadabot/utils/time";

export type StampAdminSettingsValues = Pick<
  UpdateProviderInput,
  "default_weight"
> & {
  stamp_validity_days: number;
};

export type StampAdminSettingsFormParameters = {
  disabled?: boolean;
  providerInfo: ProviderExternal;

  onSubmit?: (
    values: StampAdminSettingsValues,
    actions?: FormikHelpers<StampAdminSettingsValues>,
  ) => void;
};

export const useAdminSettingsForm = ({
  disabled,
  providerInfo,
  onSubmit: customSubmitHandler,
}: StampAdminSettingsFormParameters) => {
  const isStampValiditySet = providerInfo.stamp_validity_ms !== null;
  const { updateProvider } = useProviders();

  const [isExpiryEnabled, setIsExpiryEnabled] =
    useState<boolean>(isStampValiditySet);

  const onExpirySwitch: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = useCallback(
    (_, enabled) => setIsExpiryEnabled(enabled),
    [setIsExpiryEnabled],
  );

  const submitHandler = useCallback(
    (
      { default_weight, stamp_validity_days }: StampAdminSettingsValues,
      { setSubmitting, resetForm }: FormikHelpers<StampAdminSettingsValues>,
    ) => {
      sybilContract
        .update_provider({
          provider_id: providerInfo.id,
          default_weight,

          stamp_validity_ms: isExpiryEnabled
            ? daysToMilliseconds(stamp_validity_days)
            : null,
        })
        .then(({ id: provider_id, ...updated }) => {
          updateProvider({ provider_id, ...updated });

          resetForm({
            values: {
              default_weight: updated.default_weight,

              stamp_validity_days: millisecondsToDays(
                updated.stamp_validity_ms ?? 0,
              ),
            },
          });

          setSubmitting(false);
        })
        .catch(console.error);
    },

    [isExpiryEnabled, providerInfo.id, updateProvider],
  );

  const { dirty, isSubmitting, isValid, ...form } =
    useFormik<StampAdminSettingsValues>({
      initialValues: {
        default_weight: providerInfo.default_weight,

        stamp_validity_days: millisecondsToDays(
          providerInfo.stamp_validity_ms ?? 0,
        ),
      },

      onSubmit: customSubmitHandler ?? submitHandler,
    });

  const hasChanges = dirty || isExpiryEnabled !== isStampValiditySet;
  const isLocked = disabled || isSubmitting;

  return {
    ...form,
    hasChanges,
    isLocked,
    isDisabled: isLocked || !hasChanges || !isValid,
    isExpiryEnabled,
    isSubmitting,
    onExpirySwitch,
  };
};
