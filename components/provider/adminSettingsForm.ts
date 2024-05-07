import { FormikHelpers, useFormik } from "formik";

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
  indicatePendingUpdate?: (isSubmitting: boolean) => void;
};

export const useAdminSettingsForm = ({
  disabled,
  providerInfo,
  indicatePendingUpdate,
}: ProviderAdminSettingsFormParameters) => {
  const { updateProvider } = useProviders();

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
        indicatePendingUpdate?.(true);

        contract
          .update_provider({
            provider_id: providerInfo.id,
            default_weight,
            stamp_validity_ms: daysToMilliseconds(stamp_validity_days),
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
            indicatePendingUpdate?.(false);
          })
          .catch(console.error);
      },
    });

  const isLocked = disabled || isSubmitting;

  return {
    ...form,
    isLocked,
    isDisabled: isLocked || !dirty || !isValid,
    isSubmitting,
  };
};
