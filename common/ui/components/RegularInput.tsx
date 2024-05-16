import { Box, Stack, SxProps, Theme } from "@mui/material";
import { ChangeEvent, HTMLInputTypeAttribute, useMemo } from "react";

import colors from "@nadabot/common/ui/theme/colors";

import CustomInput from "./CustomInput";

export type RegularInputProps = {
  fontSize?: number | string;
  placeholder?: string;
  enableShadow?: boolean;
  leftComponent?: JSX.Element;
  rightComponent?: JSX.Element;
  type?: HTMLInputTypeAttribute;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  error?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  defaultValue?: string | number | readonly string[];
  autoComplete?: boolean;
  integersOnly?: boolean;
  min?: string | number;
  max?: string | number;
};

const RegularInput = ({
  fontSize,
  placeholder,
  enableShadow,
  leftComponent,
  rightComponent,
  type,
  sx,
  disabled,
  error,
  onChange,
  name,
  defaultValue,
  autoComplete,
  integersOnly,
  min,
  max,
}: RegularInputProps) => {
  const background = useMemo(
    () => (disabled ? colors.NEUTRAL100 : colors.WHITE),
    [disabled],
  );

  return (
    <Box pb={enableShadow ? 1 : 0}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        sx={{
          background: error ? colors.ERROR_RED_LIGHT : background,
          px: 2,
          border: `1px solid ${error ? colors.ERROR_RED : colors.LIGHTGRAY}`,
          borderRadius: "6px",
          height: 48,
          boxShadow: enableShadow
            ? `4px 4px 0px 0px ${colors.LIGHTGRAY}`
            : "none",
          ...sx,
        }}
      >
        {leftComponent}

        <CustomInput
          min={min}
          max={max}
          disabled={disabled}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          sx={{
            fontSize,
            width: "100%",
            color: error ? colors.ERROR_RED : colors.NEUTRAL700,
            background: error ? colors.ERROR_RED_LIGHT : "transparent",
          }}
          name={name}
          defaultValue={defaultValue}
          autoComplete={autoComplete ? "on" : "off"}
          // Integers only?
          {...(integersOnly && type === "number"
            ? {
                onKeyDown: (event) => {
                  if (event.key === ".") {
                    event.preventDefault();
                  }
                },

                onPaste: (event) => {
                  const pasteData = event.clipboardData.getData("text");
                  if (pasteData) {
                    pasteData.replace(/[^0-9]*/g, "");
                  }
                },
              }
            : {})}
        />

        {rightComponent}
      </Stack>
    </Box>
  );
};

export default RegularInput;
