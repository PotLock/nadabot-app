import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useSpinner from "@nadabot/hooks/useSpinner";
import { Routes } from "@nadabot/routes";
import { NETWORK } from "@nadabot/services/web3/constants";
import * as contract from "@nadabot/services/web3/contract-interface";
import { HumanScoreResponse } from "@nadabot/services/web3/interfaces/is-human";
import colors from "@nadabot/theme/colors";
import { SearchIconA, SearchIconB } from "@nadabot/theme/icons";

import CustomAvatar from "./CustomAvatar";
import CustomInput from "./CustomInput";
import RoundedSearchButton from "./RoundedSearchButton";
import Tag from "./Tag";
import ButtonContainer from "../containers/ButtonContainer";

const Item = (props: {
  accountId: string;
  isVerifiedHuman: boolean;
  score: number;
  useDivider?: boolean;
}) => {
  const router = useRouter();
  const { maxWidth600 } = useBreakPoints();

  const openAccountInfoHandler = useCallback(() => {
    router.push(Routes.ACCOUNT_INFO(props.accountId));
  }, [router, props.accountId]);

  return (
    <ButtonContainer onClick={openAccountInfoHandler} style={{ width: "100%" }}>
      <Stack
        direction={maxWidth600 ? "column" : "row"}
        justifyContent="space-between"
        width="100%"
        alignItems="center"
        sx={{
          borderBottom: props.useDivider ? "1px solid #F0F0F0" : "transparent",
          py: 1.5,
          px: 2,
        }}
      >
        <Stack direction="row" alignItems="center" mb={maxWidth600 ? 2 : 0}>
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
            <Typography
              fontSize={20}
              fontWeight={600}
              lineHeight="24px"
              textAlign="left"
              color={colors.PRIMARY}
              mt={1}
            >
              {props.score} Score
            </Typography>
          </Stack>
        </Stack>

        <Tag
          type={props.isVerifiedHuman ? "blue" : "red"}
          label={props.isVerifiedHuman ? "Verified Human" : "Not A Human"}
        />
      </Stack>
    </ButtonContainer>
  );
};

type Props = {
  placeholder?: string;
  enableShadow?: boolean;
  sx?: SxProps<Theme>;
};

const nearIdentityName = NETWORK === "mainnet" ? ".near" : ".testnet";

const RoundedSearchInput = ({ placeholder, enableShadow, sx }: Props) => {
  const [search, setSearch] = useState("");
  const [human, setHuman] = useState<HumanScoreResponse>();
  const { showSpinner, hideSpinner } = useSpinner();

  const searchHandler = useCallback(async () => {
    if (search) {
      const fixedSearch = search.includes(nearIdentityName)
        ? search
        : `${search}${nearIdentityName}`;

      if (fixedSearch !== search) {
        setSearch(fixedSearch);
      }

      showSpinner();
      try {
        const response = await contract.get_human_score({
          account_id: fixedSearch,
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
            value={search}
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
