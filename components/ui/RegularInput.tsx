import { HTMLInputTypeAttribute } from "react";
import { Box, Stack, SxProps, Theme } from "@mui/material";
import colors from "@nadabot/theme/colors";
import CustomInput from "./CustomInput";

type Props = {
  placeholder?: string;
  enableShadow?: boolean;
  rightComponent?: JSX.Element;
  type?: HTMLInputTypeAttribute;
  sx?: SxProps<Theme>;
};

const RegularInput = ({
  placeholder,
  enableShadow,
  rightComponent,
  type,
  sx,
}: Props) => {
  return (
    <Box pb={enableShadow ? 1 : 0}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pl: 2,
          pr: rightComponent ? 0 : 2,
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: "6px",
          height: 48,
          boxShadow: enableShadow
            ? `4px 4px 0px 0px ${colors.LIGHTGRAY}`
            : "none",
          ...sx,
        }}
      >
        <CustomInput
          placeholder={placeholder}
          type={type}
          sx={{ width: rightComponent ? "85%" : "100%" }}
        />
        {rightComponent}
      </Stack>
    </Box>
  );
};

export default RegularInput;
