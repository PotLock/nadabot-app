import { HTMLInputTypeAttribute } from "react";
import { Stack, SxProps, Theme, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RegularInput from "@nadabot/components/ui/RegularInput";
import colors from "@nadabot/theme/colors";

type Props = {
  label: string;
  placeholder: string;
  info?: string;
  optional?: boolean;
  type?: HTMLInputTypeAttribute;
  sx?: SxProps<Theme>;
};

export default function Input({
  label,
  placeholder,
  info,
  optional,
  type,
  sx,
}: Props) {
  return (
    <Stack sx={sx}>
      <Stack direction="row">
        <Typography fontWeight={600} fontSize={16}>
          {label}
        </Typography>
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
      <RegularInput placeholder={placeholder} type={type} />
      {info && (
        <Stack direction="row" alignItems="center" mt={1}>
          <InfoOutlinedIcon
            sx={{ color: colors.NEUTRAL300, fontSize: 16, mr: 0.5, mt: "-2px" }}
          />
          <Typography color={colors.NEUTRAL300} fontWeight={500} fontSize={14}>
            {info}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
