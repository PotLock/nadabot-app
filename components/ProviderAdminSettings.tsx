import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Slider, Stack, Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";

import CustomButton from "@nadabot/components/ui/CustomButton";
import Input from "@nadabot/components/ui/Input";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import * as contract from "@nadabot/services/contracts/sybil.nadabot";
import {
  ProviderExternalWithIsHuman,
  UpdateProviderInput,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";
import { daysToMilliseconds, millisecondsToDays } from "@nadabot/utils/time";

interface ProviderAdminSettingsForm
  extends Pick<UpdateProviderInput, "default_weight"> {
  stamp_validity_days: number;
}

export type ProviderAdminSettingsProps = {
  disabled?: boolean;
  providerInfo: ProviderExternalWithIsHuman;
  indicatePendingUpdate?: (hasPendingUpdate: boolean) => void;
};

export const ProviderAdminSettings = ({
  disabled = false,
  providerInfo,
  indicatePendingUpdate,
}: ProviderAdminSettingsProps) => {
  const { updateProvider } = useProviders();

  const initialValues: ProviderAdminSettingsForm = {
    default_weight: providerInfo.default_weight,

    stamp_validity_days: millisecondsToDays(
      providerInfo.stamp_validity_ms ?? 0,
    ),
  };

  const onSubmit = (
    { default_weight, stamp_validity_days }: ProviderAdminSettingsForm,
    { setSubmitting, resetForm }: FormikHelpers<ProviderAdminSettingsForm>,
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
  };

  return (
    <div>
      <Formik {...{ initialValues, onSubmit }}>
        {({
          values,
          dirty,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          const isLocked = disabled || isSubmitting;

          return (
            <form onSubmit={handleSubmit}>
              <Stack gap={2}>
                <Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" gap={0.5}>
                      <Typography fontWeight={600}>Edit Points</Typography>

                      <InfoOutlinedIcon
                        sx={{ color: colors.NEUTRAL300, width: 16 }}
                      />
                    </Stack>

                    <Stack
                      borderRadius={1}
                      border={`1px solid ${colors.NEUTRAL100}`}
                    >
                      <Typography
                        fontWeight={600}
                        color={colors.NEUTRAL500}
                        px={1}
                      >
                        {`${values.default_weight} pts`}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Slider
                    aria-label="Stamp points"
                    name="default_weight"
                    min={1}
                    max={100}
                    valueLabelDisplay="auto"
                    value={values.default_weight}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={isLocked}
                  />
                </Stack>

                <Input
                  label="Expiration Period"
                  aria-label="Expiration period in days"
                  name="stamp_validity_days"
                  labelDecoration={
                    <InfoOutlinedIcon
                      sx={{ color: colors.NEUTRAL300, width: 16 }}
                    />
                  }
                  leftComponent={
                    <AutoDeleteOutlinedIcon
                      sx={{ color: colors.NEUTRAL400, width: 22 }}
                    />
                  }
                  type="number"
                  integersOnly
                  min={0}
                  fontSize={20}
                  placeholder="30"
                  defaultValue={values.stamp_validity_days}
                  onChange={handleChange}
                  rightComponent={
                    <Typography color={colors.NEUTRAL400} fontSize={20}>
                      Days
                    </Typography>
                  }
                  errorMessage={errors.stamp_validity_days}
                  disabled={isLocked}
                />

                <CustomButton
                  type="submit"
                  color="beige"
                  bodySize="medium"
                  disabled={isLocked || !dirty}
                >
                  Save
                </CustomButton>
              </Stack>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
