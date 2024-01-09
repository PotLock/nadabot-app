import { Stack, SxProps, Theme, Typography } from "@mui/material";
import RegularInput from "@nadabot/components/ui/RegularInput";

type Props = {
  label: string;
  placeholder: string;
  sx?: SxProps<Theme>;
};

export default function Input({ label, placeholder, sx }: Props) {
  return (
    <Stack sx={sx}>
      <Typography fontWeight={600} fontSize={16}>
        {label}
      </Typography>
      <RegularInput placeholder={placeholder} />
    </Stack>
  );
}
