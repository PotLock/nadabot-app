import React, { useCallback } from "react";
import { Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import ButtonContainer from "../containers/ButtonContainer";

type Props = {
  label: string;
  leftContent?: JSX.Element;
  asButton?: boolean;
  onClick?: () => void;
};

export default function Tag({ label, leftContent, asButton, onClick }: Props) {
  const getBody = useCallback(
    () => (
      <Stack
        bgcolor={colors.GRAY100}
        px={2}
        py={0.5}
        border={`1px solid ${colors.GRAY300}`}
        borderRadius="6px"
        direction="row"
      >
        {leftContent && <Stack mr={1}>{leftContent}</Stack>}
        <Typography fontWeight={400} color={colors.GRAY}>
          {label}
        </Typography>
      </Stack>
    ),
    [label, leftContent]
  );

  if (asButton) {
    return <ButtonContainer onClick={onClick}>{getBody()}</ButtonContainer>;
  }

  return getBody();
}
