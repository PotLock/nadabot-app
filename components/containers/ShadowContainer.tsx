import { Box, Stack, SxProps, Theme } from "@mui/material";
import colors from "@nadabot/theme/colors";
import React, { ReactElement } from "react";

type Props = {
  children: ReactElement[];
  sx?: SxProps<Theme>;
};

export function ShadowContainer({ children, sx }: Props) {
  return (
    <Box pb={1}>
      <Stack
        sx={{
          boxShadow: `4px 4px 0px 0px ${colors.LIGHTGRAY}`,
          borderRadius: "8px",
          border: `3px solid ${colors.LIGHTGRAY}`,
          p: 2,
          ...sx,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
}
