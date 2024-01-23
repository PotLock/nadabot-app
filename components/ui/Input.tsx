import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Stack, SxProps, Theme, Typography } from "@mui/material";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";

import RegularInput from "@nadabot/components/ui/RegularInput";
import colors from "@nadabot/theme/colors";

type Props = {
  label?: string;
  placeholder: string;
  info?: string;
  optional?: boolean;
  type?: HTMLInputTypeAttribute;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  errorMessage?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  defaultValue?: string | number | readonly string[];
  autoComplete?: boolean;
  integersOnly?: boolean;
};

export default function Input({
  label,
  placeholder,
  info,
  optional,
  type,
  sx,
  disabled,
  errorMessage,
  onChange,
  name,
  defaultValue,
  autoComplete,
  integersOnly,
}: Props) {
  return (
    <Stack sx={sx}>
      <Stack direction="row">
        {label && (
          <Typography
            fontWeight={600}
            fontSize={16}
            sx={{ opacity: disabled ? 0.5 : 1 }}
          >
            {label}
          </Typography>
        )}
        {optional && (
          <Typography
            fontWeight={600}
            fontSize={16}
            color={colors.NEUTRAL500}
            ml={0.5}
          >
            (optional)
          </Typography>
        )}
      </Stack>
      <RegularInput
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        error={!!errorMessage}
        onChange={onChange}
        name={name}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        integersOnly={integersOnly}
      />
      {info && (
        <Stack direction="row" alignItems="center" mt={1}>
          <InfoOutlinedIcon
            sx={{
              color: errorMessage ? colors.ERROR_RED : colors.NEUTRAL300,
              fontSize: 16,
              mr: 0.5,
              mt: "-2px",
            }}
          />
          <Typography
            color={errorMessage ? colors.ERROR_RED : colors.NEUTRAL300}
            fontWeight={500}
            fontSize={14}
          >
            {info}
          </Typography>
        </Stack>
      )}
      {/* Show error only if a Info is not provided */}
      {errorMessage && (
        <Typography mt={1} fontSize={13} color={colors.ERROR_RED}>
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
}
