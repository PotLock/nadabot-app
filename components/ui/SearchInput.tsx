import { Box, Stack, SxProps, Theme } from "@mui/material";
import colors from "@nadabot/theme/colors";
import { SearchIconA } from "@nadabot/theme/icons";
import CustomInput from "./CustomInput";

type Props = {
  placeholder?: string;
  enableShadow?: boolean;
  sx?: SxProps<Theme>;
};

const SearchInput = ({ placeholder, enableShadow, sx }: Props) => {
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
        <SearchIconA sx={{ width: 16, mr: 2 }} />
      </Stack>
    </Box>
  );
};

export default SearchInput;
