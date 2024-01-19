import React, { useCallback } from "react";
import { Stack, SxProps, Theme, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import ButtonContainer from "../containers/ButtonContainer";

type Props = {
  label: string;
  leftContent?: JSX.Element;
  asButton?: boolean;
  onClick?: () => void;
  size?: "small" | "normal";
  removeBg?: boolean;
  sx?: SxProps<Theme>;
};

export default function Tag({
  label,
  leftContent,
  asButton,
  onClick,
  size = "normal",
  removeBg,
  sx,
}: Props) {
  const getBody = useCallback(
    () => (
      <Stack
        bgcolor={removeBg ? "transparent" : colors.GRAY100}
        px={2}
        py={0.5}
        border={`1px solid ${colors.GRAY300}`}
        borderRadius="6px"
        direction="row"
        alignItems="center"
        sx={{ ...sx }}
      >
        {leftContent && <Stack mr={1}>{leftContent}</Stack>}
        <Typography
          fontWeight={400}
          color={colors.GRAY}
          fontSize={size === "small" ? 14 : 16}
        >
          {label}
        </Typography>
      </Stack>
    ),
    [label, leftContent, size, removeBg, sx]
  );

  if (asButton) {
    return <ButtonContainer onClick={onClick}>{getBody()}</ButtonContainer>;
  }

  return getBody();
}
