import {
  Slider as GenericSlider,
  SliderProps as GenericSliderProps,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

import colors from "@nadabot/theme/colors";

export type SliderProps = Pick<
  GenericSliderProps,
  "disabled" | "min" | "max" | "name" | "onBlur" | "onChange" | "value"
> & {
  label: string;
  labelDecoration?: JSX.Element;
  unitLabel?: string;
};

export const Slider: React.FC<SliderProps> = ({
  disabled = false,
  label,
  labelDecoration,
  unitLabel,
  value,
  ...props
}) => {
  const displayValue = useMemo(
    () => `${value} ${unitLabel ?? ""}`.trim(),
    [unitLabel, value],
  );

  const inputProps = useMemo(
    () => ({ disabled, value, ...props }),
    [disabled, props, value],
  );

  return (
    <Stack gap={1}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={0.5}>
          <Typography
            color={colors.NEUTRAL950}
            fontSize={16}
            fontWeight={500}
            sx={{ opacity: disabled ? 0.5 : 1 }}
          >
            {label}
          </Typography>

          {labelDecoration}
        </Stack>

        <Stack
          borderRadius={1}
          border={`1px solid ${colors.NEUTRAL100}`}
          bgcolor={colors.WHITE}
        >
          <Typography fontWeight={600} color={colors.NEUTRAL500} px={1}>
            {displayValue}
          </Typography>
        </Stack>
      </Stack>

      <GenericSlider
        aria-label={label}
        valueLabelDisplay="auto"
        sx={{
          p: 0,
          height: 24,
          borderRadius: 1,
          background: colors.NEUTRAL100,
        }}
        slotProps={{
          track: {
            style: {
              borderRadius: 4,
              borderColor: disabled ? colors.NEUTRAL200 : undefined,
              height: 24,
              background: disabled ? colors.NEUTRAL200 : undefined,
            },
          },

          thumb: {
            style: {
              borderRadius: 4,
              borderColor: disabled ? colors.NEUTRAL200 : undefined,
              width: 24,
              height: 24,
              background: disabled ? colors.NEUTRAL200 : undefined,
            },
          },
        }}
        {...inputProps}
      />
    </Stack>
  );
};
