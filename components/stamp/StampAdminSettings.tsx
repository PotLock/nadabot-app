import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Stack, Switch, SxProps, Theme, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import CustomButton from "@nadabot/common/ui/components/CustomButton";
import Input from "@nadabot/common/ui/components/Input";
import { Slider } from "@nadabot/common/ui/components/Slider";
import colors from "@nadabot/common/ui/theme/colors";

import {
  StampAdminSettingsFormParameters,
  useAdminSettingsForm,
} from "./adminSettingsForm";

export type StampAdminSettingsProps = Pick<
  StampAdminSettingsFormParameters,
  "disabled" | "providerInfo"
> & {
  embedded?: boolean;
  heading?: string;
  indicateUnsavedChanges?: (hasUnsavedChanges: boolean) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps<Theme>;
};

export const StampAdminSettings = ({
  embedded = false,
  disabled = false,
  heading = "Admin Settings",
  onChange,
  indicateUnsavedChanges,
  providerInfo,
  sx,
}: StampAdminSettingsProps) => {
  const router = useRouter();
  const isStampPage = router.pathname.startsWith("/stamp/");
  const isSubform = typeof onChange === "function";

  const {
    errors,
    handleBlur,
    handleSubmit,
    handleReset,
    hasChanges,
    isExpiryEnabled,
    isDisabled,
    isLocked,
    isSubmitting,
    onExpirySwitch,
    values,
    ...form
  } = useAdminSettingsForm({
    isSubform,
    disabled,
    providerInfo,
  });

  const handleChange = onChange ?? form.handleChange;

  useEffect(
    () => void indicateUnsavedChanges?.(hasChanges),
    [hasChanges, indicateUnsavedChanges],
  );

  const actions = useMemo(
    () =>
      isSubform ? null : (
        <Stack
          display={embedded && isDisabled ? "none" : "flex"}
          direction="row"
          justifyContent="space-between"
          gap={2}
          p={2}
          sx={{
            borderTop: embedded ? `1px solid ${colors.LIGHTGRAY}` : "none",
          }}
        >
          <CustomButton
            type="reset"
            color="red"
            variant="outlined"
            bodySize="medium"
            disabled={isDisabled}
          >
            Discard
          </CustomButton>

          <CustomButton
            type="submit"
            color="black"
            bodySize="medium"
            disabled={isDisabled}
            progress={isSubmitting}
            sx={{ width: "100%" }}
          >
            Save
          </CustomButton>
        </Stack>
      ),

    [embedded, isDisabled, isSubform, isSubmitting],
  );

  return (
    <Stack
      gap={2}
      component={isSubform ? "div" : "form"}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <Stack px={embedded ? 2 : 0}>
        <Stack
          p={2}
          gap={2}
          borderRadius={2}
          border={`1px solid ${embedded ? colors.NEUTRAL100 : colors.NEUTRAL200}`}
          minWidth={embedded ? "100%" : 352}
          height="fit-content"
          bgcolor={embedded ? colors.GRAY100 : "transparent"}
          {...{ sx }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <SettingsOutlinedIcon fontSize="medium" sx={{ pb: 0.25 }} />

            <Typography fontSize={16} fontWeight={600}>
              {heading}
            </Typography>
          </Stack>

          <Stack gap={2}>
            <Slider
              label="Edit Points"
              name="default_weight"
              labelDecoration={
                <InfoOutlinedIcon
                  sx={{ color: colors.NEUTRAL300, width: 16, height: 16 }}
                />
              }
              min={1}
              max={100}
              value={values.default_weight ?? 0}
              unitLabel="pts"
              onBlur={handleBlur}
              // @ts-expect-error-next-line
              onChange={handleChange}
              disabled={isLocked}
            />

            <Input
              label="Expiration Period"
              name="stamp_validity_days"
              labelDecoration={
                <Stack
                  width="100%"
                  height={20}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                  marginRight={"-12px"}
                >
                  <InfoOutlinedIcon
                    sx={{ color: colors.NEUTRAL300, width: 16, height: 16 }}
                  />

                  <Switch
                    disableRipple
                    checked={isExpiryEnabled}
                    onChange={onExpirySwitch}
                  />
                </Stack>
              }
              leftComponent={
                <AutoDeleteOutlinedIcon
                  sx={{ color: colors.NEUTRAL400, width: 22, height: 22 }}
                />
              }
              type="number"
              integersOnly
              min={0}
              fontSize={20}
              defaultValue={values.stamp_validity_days}
              onChange={handleChange}
              rightComponent={
                <Typography color={colors.NEUTRAL400} fontSize={20}>
                  Days
                </Typography>
              }
              errorMessage={errors.stamp_validity_days}
              disabled={isLocked || !isExpiryEnabled}
            />

            {!isStampPage && embedded && (
              <Link
                href={{
                  pathname: `/stamp/edit/${providerInfo.id}`,
                }}
                color={colors.NEUTRAL700}
                style={{
                  width: "fit-content",
                  textDecoration: "underline",
                }}
              >
                View full settings
              </Link>
            )}
          </Stack>
        </Stack>
      </Stack>

      {actions}
    </Stack>
  );
};
