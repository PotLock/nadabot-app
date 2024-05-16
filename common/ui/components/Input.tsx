import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Stack, Typography } from "@mui/material";

import RegularInput, {
  RegularInputProps,
} from "@nadabot/common/ui/components/RegularInput";
import colors from "@nadabot/common/ui/theme/colors";

type Props = Pick<
  RegularInputProps,
  | "autoComplete"
  | "defaultValue"
  | "fontSize"
  | "disabled"
  | "integersOnly"
  | "min"
  | "max"
  | "name"
  | "onChange"
  | "leftComponent"
  | "placeholder"
  | "rightComponent"
  | "sx"
  | "type"
> & {
  label?: string;
  labelDecoration?: JSX.Element;
  info?: string;
  optional?: boolean;
  errorMessage?: string;
};

export default function Input({
  fontSize,
  label,
  labelDecoration,
  placeholder,
  leftComponent,
  rightComponent,
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
  min,
  max,
}: Props) {
  return (
    <Stack gap={1} sx={sx}>
      <Stack direction="row" gap={0.5} alignItems="center">
        <Stack direction="row" gap={0.5}>
          {label && (
            <Typography
              color={colors.NEUTRAL950}
              fontWeight={500}
              fontSize={16}
              noWrap
              sx={{ opacity: disabled ? 0.5 : 1 }}
            >
              {label}
            </Typography>
          )}

          {optional && (
            <Typography
              color={colors.NEUTRAL500}
              fontWeight={500}
              fontSize={16}
              sx={{ opacity: disabled ? 0.5 : 1 }}
            >
              (optional)
            </Typography>
          )}
        </Stack>

        {labelDecoration}
      </Stack>

      <RegularInput
        fontSize={fontSize}
        placeholder={placeholder}
        leftComponent={leftComponent}
        rightComponent={rightComponent}
        type={type}
        disabled={disabled}
        error={!!errorMessage}
        onChange={onChange}
        name={name}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        integersOnly={integersOnly}
        min={min}
        max={max}
      />

      {info && (
        <Stack direction="row" alignItems="center">
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
        <Typography fontSize={13} color={colors.ERROR_RED}>
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
}
