import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { Box, Stack, SxProps, Theme } from "@mui/material";
import colors from "@nadabot/theme/colors";
import CustomInput from "./CustomInput";

type Props = {
  placeholder?: string;
  enableShadow?: boolean;
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
};

const RegularInput = ({
  placeholder,
  enableShadow,
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
}: Props) => {
  return (
    <Box pb={enableShadow ? 1 : 0}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: error ? colors.ERROR_RED_LIGHT : "transparent",
          pl: 2,
          pr: rightComponent ? 0 : 2,
          border: `1px solid ${error ? colors.ERROR_RED : colors.LIGHTGRAY}`,
          borderRadius: "6px",
          height: 48,
          boxShadow: enableShadow
            ? `4px 4px 0px 0px ${colors.LIGHTGRAY}`
            : "none",
          ...sx,
        }}
      >
        <CustomInput
          disabled={disabled}
          placeholder={placeholder}
          type={type}
          onChange={onChange}
          sx={{
            width: rightComponent ? "85%" : "100%",
            color: error ? colors.ERROR_RED : colors.NEUTRAL700,
            background: error ? colors.ERROR_RED_LIGHT : "transparent",
          }}
          name={name}
          defaultValue={defaultValue}
          autoComplete={autoComplete ? "on" : "off"}
          // Intergers only?
          {...(integersOnly && type === "number"
            ? {
                onKeyDown: (event) => {
                  if (event.key === ".") {
                    event.preventDefault();
                  }
                },
                onPaste: (event) => {
                  let pasteData = event.clipboardData.getData("text");
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
