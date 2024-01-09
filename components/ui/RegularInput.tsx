import { Box, Stack, SxProps, Theme } from "@mui/material";
import colors from "@nadabot/theme/colors";
import CustomInput from "./CustomInput";

type Props = {
  placeholder?: string;
  enableShadow?: boolean;
  rightComponent?: JSX.Element;
  sx?: SxProps<Theme>;
};

const RegularInput = ({
  placeholder,
  enableShadow,
  rightComponent,
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
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: "6px",
          height: 48,
          boxShadow: enableShadow
            ? `4px 4px 0px 0px ${colors.LIGHTGRAY}`
            : "none",
          ...sx,
        }}
      >
        <CustomInput placeholder={placeholder} />
        {rightComponent}
      </Stack>
    </Box>
  );
};

export default RegularInput;
