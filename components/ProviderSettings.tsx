import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Slider, Stack, Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import { ChangeEvent, useCallback, useState } from "react";

import CustomButton from "@nadabot/components/ui/CustomButton";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import * as contract from "@nadabot/services/contracts/sybil.nadabot";
import {
  ProviderExternalWithIsHuman,
  UpdateProviderInput,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";
import { daysToMilliseconds, millisecondsToDays } from "@nadabot/utils/time";

import Input from "./ui/Input";

export type ProviderSettingsProps = {
  disabled?: boolean;
  providerInfo: ProviderExternalWithIsHuman;
};

interface FormValues
  extends Pick<UpdateProviderInput, "default_weight" | "stamp_validity_ms"> {}

export const ProviderSettings = ({
  disabled = false,
  providerInfo,
}: ProviderSettingsProps) => {
  const { default_weight, stamp_validity_ms } = providerInfo;
  const initialValues: FormValues = { default_weight, stamp_validity_ms };

  const { updateProvider } = useProviders();

  const [expiryMs, setExpiryMs] = useState<null | number>(
    providerInfo.stamp_validity_ms ?? null,
  );

  const expiryDays = millisecondsToDays(expiryMs);

  const onExpiryChange = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setExpiryMs(daysToMilliseconds(parseInt(value))),

    [setExpiryMs],
  );

  const onSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    console.table(values);

    contract
      .update_provider({ provider_id: providerInfo.id, ...values })
      .then((provider) => {
        updateProvider({ provider_id: provider.id, ...provider });
        setSubmitting(false);
      })
      .catch(console.error);
  };

  return (
    <div>
      <Formik {...{ initialValues, onSubmit }}>
        {({
          values,
          errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          const isDisabled = disabled || isSubmitting;

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
                    disabled={isDisabled}
                  />
                </Stack>

                <Input
                  label="Expiration Period"
                  aria-label="Expiration period in days"
                  name="stamp_validity_ms"
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
                  defaultValue={expiryDays}
                  onChange={onExpiryChange}
                  rightComponent={
                    <Typography color={colors.NEUTRAL400} fontSize={20}>
                      Days
                    </Typography>
                  }
                  errorMessage={errors.stamp_validity_ms}
                  disabled={isDisabled}
                />

                <CustomButton
                  type="submit"
                  color="beige"
                  bodySize="medium"
                  disabled={isDisabled}
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
