import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";

import colors from "@nadabot/theme/colors";
import { SearchIconA, SearchIconB } from "@nadabot/theme/icons";

import CustomAvatar from "./CustomAvatar";
import CustomInput from "./CustomInput";
import RoundedSearchButton from "./RoundedSearchButton";
import Tag from "./Tag";

const Item = (props: { accountId: string; useDivider?: boolean }) => {
  // TODO: use real info
  const isVerifiedHuman = true;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      width="100%"
      alignItems="center"
      sx={{
        borderBottom: props.useDivider ? "1px solid #F0F0F0" : "transparent",
        py: 1.5,
        px: 2,
      }}
    >
      <Stack direction="row" alignItems="center">
        <CustomAvatar accountId={props.accountId} size={64} fontSize={22} />
        <Stack ml={2}>
          <Typography
            fontSize={20}
            color={colors.NEUTRAL500}
            fontWeight={500}
            lineHeight="20px"
          >
            {props.accountId}
          </Typography>
          <Typography fontSize={20} fontWeight={600} lineHeight="24px">
            20 Score
          </Typography>
        </Stack>
      </Stack>

      <Tag
        type={isVerifiedHuman ? "blue" : "red"}
        label={isVerifiedHuman ? "Verified Human" : "Not A Human"}
      />
    </Stack>
  );
};

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

      {/* Result Items */}
      {/* <Stack
        alignItems="center"
        justifyContent="space-between"
        sx={{
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: "32px",
          boxShadow: enableShadow
            ? `4px 4px 0px 0px ${colors.LIGHTGRAY}`
            : "none",
          ...sx,
        }}
      >
        <Item accountId="wendersonpires.testnet" useDivider />
        <Item accountId="wendersonpires.testnet" useDivider />
        <Item accountId="wendersonpires.testnet" />
      </Stack> */}
    </Box>
  );
};

export default RoundedSearchInput;
