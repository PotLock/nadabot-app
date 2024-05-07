import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Slider, Stack, SxProps, Theme, Typography } from "@mui/material";
import { useMemo } from "react";

import CustomButton from "@nadabot/components/ui/CustomButton";
import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import Input from "@nadabot/components/ui/Input";
import colors from "@nadabot/theme/colors";

import {
  ProviderAdminSettingsFormParameters,
  useAdminSettingsForm,
} from "./adminSettingsForm";

export type ProviderAdminSettingsProps = Pick<
  ProviderAdminSettingsFormParameters,
  "disabled" | "providerInfo" | "indicatePendingUpdate"
> & {
  embedded?: boolean;
  sx?: SxProps<Theme>;
};

export const ProviderAdminSettings = ({
  embedded = false,
  disabled = false,
  providerInfo,
  indicatePendingUpdate,
  sx,
}: ProviderAdminSettingsProps) => {
  const {
    errors,
    isDisabled,
    isLocked,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    values,
  } = useAdminSettingsForm({
    disabled,
    providerInfo,
    indicatePendingUpdate,
  });

  const editingActions = useMemo(
    () => (
      <Stack
        direction="row"
        justifyContent="space-between"
        gap={2}
        display={embedded && isDisabled ? "none" : "flex"}
      >
        <CustomButton
          type="reset"
          color="red"
          bodySize="medium"
          disabled={isDisabled}
        >
          Cancel
        </CustomButton>

        {isSubmitting ? (
          <CustomCircularProgress sx={{ py: 1 }} size={30} />
        ) : (
          <CustomButton
            type="submit"
            color="beige"
            bodySize="medium"
            disabled={isDisabled}
          >
            Save
          </CustomButton>
        )}
      </Stack>
    ),

    [embedded, isDisabled, isSubmitting],
  );

  return (
    <Stack
      gap={2}
      component="form"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <Stack
        p={2}
        gap={2}
        borderRadius={2}
        border={`1px solid ${embedded ? colors.NEUTRAL100 : colors.NEUTRAL200}`}
        minWidth={embedded ? "100%" : 352}
        height="fit-content"
        bgcolor={embedded ? "#F8F8F8" : "transparent"}
        {...{ sx }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <SettingsOutlinedIcon fontSize="medium" />

          <Typography fontSize={16} fontWeight={600}>
            Admin Settings
          </Typography>
        </Stack>

        <Stack gap={2}>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" gap={0.5}>
                <Typography fontWeight={600}>Edit Points</Typography>

                <InfoOutlinedIcon
                  sx={{ color: colors.NEUTRAL300, width: 16 }}
                />
              </Stack>

              <Stack borderRadius={1} border={`1px solid ${colors.NEUTRAL100}`}>
                <Typography fontWeight={600} color={colors.NEUTRAL500} px={1}>
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
              <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300, width: 16 }} />
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

          {!embedded && editingActions}
        </Stack>
      </Stack>

      {embedded && editingActions}
    </Stack>
  );
};
