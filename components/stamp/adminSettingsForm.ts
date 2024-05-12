import { FormikHelpers, useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";

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
  onChange?: (values: StampAdminSettingsValues) => void;
};

export const useAdminSettingsForm = ({
  disabled,
  providerInfo,
  onChange,
}: StampAdminSettingsFormParameters) => {
  const isSubform = typeof onChange === "function";
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

  const onSubmit = useCallback(
    (
      { default_weight, stamp_validity_days }: StampAdminSettingsValues,
      { setSubmitting, resetForm }: FormikHelpers<StampAdminSettingsValues>,
    ) => {
      if (!isSubform) {
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
      }
    },

    [isExpiryEnabled, isSubform, providerInfo.id, updateProvider],
  );

  const { dirty, isSubmitting, isValid, ...form } =
    useFormik<StampAdminSettingsValues>({
      initialValues: {
        default_weight: providerInfo.default_weight,

        stamp_validity_days: millisecondsToDays(
          providerInfo.stamp_validity_ms ?? 0,
        ),
      },

      onSubmit,
    });

  const hasChanges = dirty || isExpiryEnabled !== isStampValiditySet;
  const isLocked = disabled || isSubmitting;

  useEffect(() => {
    if (isSubform) onChange(form.values);
  }, [form.values, isSubform, onChange]);

  return {
    ...form,
    hasChanges,
    isLocked,
    isDisabled: isLocked || !hasChanges || !isValid,
    isExpiryEnabled,
    isSubform,
    isSubmitting,
    onExpirySwitch,
  };
};
