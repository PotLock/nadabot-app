import { FormikHelpers, useFormik } from "formik";
import { useCallback, useState } from "react";

import { useProviders } from "@nadabot/hooks/store/useProviders";
import * as contract from "@nadabot/services/contracts/sybil.nadabot";
import {
  ProviderExternal,
  UpdateProviderInput,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import { daysToMilliseconds, millisecondsToDays } from "@nadabot/utils/time";

interface ProviderAdminSettingsValues
  extends Pick<UpdateProviderInput, "default_weight"> {
  stamp_validity_days: number;
}

export type ProviderAdminSettingsFormParameters = {
  disabled?: boolean;
  providerInfo: ProviderExternal;
};

export const useAdminSettingsForm = ({
  disabled,
  providerInfo,
}: ProviderAdminSettingsFormParameters) => {
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

  const { dirty, isSubmitting, isValid, ...form } =
    useFormik<ProviderAdminSettingsValues>({
      initialValues: {
        default_weight: providerInfo.default_weight,

        stamp_validity_days: millisecondsToDays(
          providerInfo.stamp_validity_ms ?? 0,
        ),
      },

      onSubmit: (
        { default_weight, stamp_validity_days }: ProviderAdminSettingsValues,
        {
          setSubmitting,
          resetForm,
        }: FormikHelpers<ProviderAdminSettingsValues>,
      ) => {
        contract
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
