import { Stack, SxProps, Theme, Typography } from "@mui/material";
import { useMemo } from "react";

import ButtonContainer from "./ButtonContainer";
import colors from "../colors";

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

export type TagProps = {
  color?: string;
  bgColor?: string;
  fontWeight?: number;
  label: string;
  leftContent?: JSX.Element;
  asButton?: boolean;
  onClick?: () => void;
  size?: "small" | "normal";
  removeBg?: boolean;
  removeBorder?: boolean;
  sx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
  type?: "normal" | "red" | "blue";
};

export default function Tag({
  color,
  bgColor,
  fontWeight,
  label,
  leftContent,
  asButton,
  onClick,
  size = "normal",
  removeBg,
  removeBorder = false,
  sx,
  labelSx,
  type = "normal",
}: TagProps) {
  const body = useMemo(
    () => (
      <Stack
        bgcolor={bgColor ?? (removeBg ? "transparent" : bgColors[type])}
        px={2}
        py={0.5}
        border={
          !removeBorder && type === "normal"
            ? `1px solid ${colors.GRAY300}`
            : "none"
        }
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
          fontWeight={fontWeight ?? (type === "normal" ? 400 : 600)}
          color={color ?? textColors[type]}
          fontSize={size === "small" ? 14 : 14}
          py={size === "small" ? 0 : 0.4}
          sx={{ ...labelSx }}
        >
          {label}
        </Typography>
      </Stack>
    ),

    [
      bgColor,
      removeBg,
      type,
      removeBorder,
      sx,
      leftContent,
      fontWeight,
      color,
      size,
      labelSx,
      label,
    ],
  );

  return asButton ? (
    <ButtonContainer onClick={onClick}>{body}</ButtonContainer>
  ) : (
    body
  );
}
