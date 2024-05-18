import { FormikHelpers, useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";

import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import {
  ProviderExternal,
  UpdateProviderInput,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import {
  daysToMilliseconds,
  millisecondsToDays,
} from "@nadabot/common/utils/time";
import { useProviders } from "@nadabot/hooks/store/useProviders";

export type StampAdminSettingsValues = Pick<
  UpdateProviderInput,
  "default_weight"
> & {
  stamp_validity_days: number;
};

export type StampAdminFormParameters = {
  isSubform?: boolean;
  disabled?: boolean;
  providerInfo: ProviderExternal;
};

export const useStampAdminForm = ({
  isSubform = false,
  disabled,
  providerInfo,
}: StampAdminFormParameters) => {
  const isStampValiditySet = providerInfo.stamp_validity_ms !== null;
  const { updateProvider } = useProviders();

  const [isExpiryEnabled, setIsExpiryEnabled] =
    useState<boolean>(isStampValiditySet);

  const initialValues: StampAdminSettingsValues = useMemo(
    () => ({
      default_weight: providerInfo.default_weight,

      stamp_validity_days: millisecondsToDays(
        providerInfo.stamp_validity_ms ?? 0,
      ),
    }),

    [providerInfo.default_weight, providerInfo.stamp_validity_ms],
  );

  const onSubmit = useCallback(
    async (
      { default_weight, stamp_validity_days }: StampAdminSettingsValues,
      { setSubmitting, resetForm }: FormikHelpers<StampAdminSettingsValues>,
    ) => {
      await sybilContract
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
        })
        .catch(console.error);

      setSubmitting(false);
    },

    [isExpiryEnabled, providerInfo.id, updateProvider],
  );

  const {
    dirty,
    handleChange,
    isSubmitting,
    isValid,
    setValues,
    values,
    ...form
  } = useFormik<StampAdminSettingsValues>({
    initialValues,
    onSubmit: isSubform ? () => void null : onSubmit,
  });

  useEffect(() => {
    if (isSubform && JSON.stringify(values) !== JSON.stringify(initialValues)) {
      setValues(initialValues);
    }
  }, [initialValues, isSubform, setValues, values]);

  const onExpirySwitch: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = useCallback((_, enabled) => setIsExpiryEnabled(enabled), []);

  const hasChanges = dirty || isExpiryEnabled !== isStampValiditySet;
  const isLocked = disabled || isSubmitting;

  useEffect(
    () => Object.values(form.errors).forEach(console.error),
    [form.errors],
  );

  return {
    ...form,
    handleChange,
    hasChanges,
    isLocked,
    isDisabled: isLocked || !hasChanges || !isValid,
    isExpiryEnabled,
    isSubmitting,
    onExpirySwitch,
    values,
  };
};
