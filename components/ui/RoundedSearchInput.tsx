import { Box, Stack, SxProps, Theme } from "@mui/material";
import colors from "@nadabot/theme/colors";
import { SearchIconA, SearchIconB } from "@nadabot/theme/icons";
import RoundedSearchButton from "./RoundedSearchButton";
import CustomInput from "./CustomInput";

type Props = {
  placeholder?: string;
  enableShadow?: boolean;
  sx?: SxProps<Theme>;
};

const RoundedSearchInput = ({ placeholder, enableShadow, sx }: Props) => {
  return (
    <Box pb={1}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: 32,
          height: 48,
          boxShadow: enableShadow
            ? `4px 4px 0px 0px ${colors.LIGHTGRAY}`
            : "none",
          ...sx,
        }}
      >
        <Stack direction="row" alignItems="center" width="100%">
          <SearchIconA sx={{ width: 16, m: 2, mr: 1 }} />
          <CustomInput placeholder={placeholder} />
        </Stack>
        <RoundedSearchButton>
          <SearchIconB sx={{ width: 18 }} />
        </RoundedSearchButton>
      </Stack>
    </Box>
  );
};

export default RoundedSearchInput;
