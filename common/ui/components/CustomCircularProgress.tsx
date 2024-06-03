import { CircularProgress, Stack, SxProps, Theme } from "@mui/material";

import colors from "../colors";

type Props = {
  sx?: SxProps<Theme>;
  size?: number;
};

export default function CustomCircularProgress({ sx, size }: Props) {
  return (
    <Stack justifyContent="center" alignItems="center" p={12} sx={{ ...sx }}>
      <CircularProgress size={size} sx={{ color: colors.BLUE }} />
    </Stack>
  );
}
