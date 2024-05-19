import { Stack, SxProps, Theme, Typography } from "@mui/material";
import React, { useCallback } from "react";

import colors from "@nadabot/common/ui/colors";

import ButtonContainer from "./ButtonContainer";

const bgColors = {
  red: "#FCCFCF",
  blue: "#D5E1F8",
  normal: colors.GRAY100,
};

const textColors = {
  red: "#DD3345",
  blue: "#2D6FDB",
  normal: colors.GRAY,
};

type Props = {
  label: string;
  leftContent?: JSX.Element;
  asButton?: boolean;
  onClick?: () => void;
  size?: "small" | "normal";
  removeBg?: boolean;
  sx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
  type?: "normal" | "red" | "blue";
};

export default function Tag({
  label,
  leftContent,
  asButton,
  onClick,
  size = "normal",
  removeBg,
  sx,
  labelSx,
  type = "normal",
}: Props) {
  const getBody = useCallback(
    () => (
      <Stack
        bgcolor={removeBg ? "transparent" : bgColors[type]}
        px={2}
        py={0.5}
        border={type === "normal" ? `1px solid ${colors.GRAY300}` : "none"}
        borderRadius={type === "normal" ? "6px" : "32px"}
        direction="row"
        alignItems="center"
        boxShadow={
          type === "normal" ? "none" : `0px 0px 0px 1px ${textColors[type]}`
        }
        sx={{ ...sx }}
      >
        {leftContent && <Stack mr={1}>{leftContent}</Stack>}
        <Typography
          fontWeight={type === "normal" ? 400 : 600}
          color={textColors[type]}
          fontSize={size === "small" ? 14 : 14}
          py={size === "small" ? 0 : 0.4}
          sx={{ ...labelSx }}
        >
          {label}
        </Typography>
      </Stack>
    ),
    [label, leftContent, size, removeBg, sx, type, labelSx],
  );

  if (asButton) {
    return <ButtonContainer onClick={onClick}>{getBody()}</ButtonContainer>;
  }

  return getBody();
}
