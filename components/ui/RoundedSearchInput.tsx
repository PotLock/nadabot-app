import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import useSpinner from "@nadabot/hooks/useSpinner";
import * as contract from "@nadabot/services/web3/contract-interface";
import { HumanScoreResponse } from "@nadabot/services/web3/interfaces/is-human";
import colors from "@nadabot/theme/colors";
import { SearchIconA, SearchIconB } from "@nadabot/theme/icons";

import CustomAvatar from "./CustomAvatar";
import CustomInput from "./CustomInput";
import RoundedSearchButton from "./RoundedSearchButton";
import Tag from "./Tag";

const Item = (props: {
  accountId: string;
  isVerifiedHuman: boolean;
  score: number;
  useDivider?: boolean;
}) => {
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
            {props.score} Score
          </Typography>
        </Stack>
      </Stack>

      <Tag
        type={props.isVerifiedHuman ? "blue" : "red"}
        label={props.isVerifiedHuman ? "Verified Human" : "Not A Human"}
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
  const [search, setSearch] = useState("");
  const [human, setHuman] = useState<HumanScoreResponse>();
  const { showSpinner, hideSpinner } = useSpinner();

  const searchHandler = useCallback(async () => {
    if (search) {
      showSpinner();
      try {
        const response = await contract.get_human_score({
          account_id: search,
        });
        setHuman(response);
      } catch {
        setHuman(undefined);
      }
      hideSpinner();
    }
  }, [search, showSpinner, hideSpinner]);

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
          <CustomInput
            placeholder={placeholder}
            onChange={(e) => {
              setSearch(e.target.value);
              setHuman(undefined);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchHandler();
              }
            }}
          />
        </Stack>
        <RoundedSearchButton onClick={searchHandler}>
          <SearchIconB sx={{ width: 18 }} />
        </RoundedSearchButton>
      </Stack>

      {/* Result Items */}
      {human && (
        <Stack
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
          <Item
            accountId={search}
            isVerifiedHuman={human.is_human}
            score={human.score}
          />
        </Stack>
      )}
    </Box>
  );
};

export default RoundedSearchInput;
