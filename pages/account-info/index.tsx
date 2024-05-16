import { Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { get_user_profile } from "@nadabot/common/services/contracts/social";
import * as contract from "@nadabot/common/services/contracts/sybil.nadabot";
import { HumanScoreResponse } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/is-human";
import { StampExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/stamps";
import CustomAvatar from "@nadabot/common/ui/components/CustomAvatar";
import CustomCircularProgress from "@nadabot/common/ui/components/CustomCircularProgress";
import GridContainer from "@nadabot/common/ui/components/GridContainer";
import Tag from "@nadabot/common/ui/components/Tag";
import colors from "@nadabot/common/ui/theme/colors";
import insertIsHumanToProvider from "@nadabot/common/utils/insertIsHumanToProvider";
import { StampCard } from "@nadabot/components/stamp/StampCard";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useViewStampURLQuery from "@nadabot/hooks/useViewStampURLQuery";

export default function AccountInfoPage() {
  // Show ViewProviderDialog if the URL has `viewStamp` query
  useViewStampURLQuery();

  const { maxWidth805, maxWidth600 } = useBreakPoints();
  const router = useRouter();
  const [accountId, setAccountId] = useState<string>();
  const [human, setHuman] = useState<HumanScoreResponse>();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(accountId);
  const [userStamps, setUserStamps] = useState<StampExternal[]>([]);

  // Get and set the accountId provided by url query
  useEffect(() => {
    const qAccountId = router.query?.accountId;
    if (qAccountId) {
      setAccountId(qAccountId as string);
    }
  }, [router]);

  // Load profile info + check human
  useEffect(() => {
    if (accountId) {
      (async () => {
        // Profile info
        const profileInfo = await get_user_profile({ accountId });
        setUsername(profileInfo?.name || accountId);

        // Is Human Check
        const response = await contract.get_human_score({
          account_id: accountId,
        });
        setHuman(response);

        // Get stamps for this user
        const stamps = await contract.get_stamps_for_account_id({
          account_id: accountId,
        });
        setUserStamps(stamps);

        setLoading(false);
      })();
    }
  }, [accountId]);

  const StampCards = useCallback(
    () =>
      userStamps.map((stamp) => (
        <StampCard
          key={stamp.provider.id}
          providerInfo={insertIsHumanToProvider(stamp.provider)}
          isStamp
        />
      )),
    [userStamps],
  );

  return (
    <Container sx={{ mb: 8 }}>
      {/* Header */}
      {!loading && (
        <Stack
          direction={maxWidth805 ? "column" : "row"}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left */}
          <Stack direction={maxWidth805 ? "column" : "row"} alignItems="center">
            <CustomAvatar accountId={accountId} size={84} fontSize={22} />
            <Stack ml={2} mt={maxWidth805 ? 2 : 0}>
              <Typography
                fontWeight={600}
                fontSize={32}
                lineHeight="24px"
                textAlign={maxWidth805 ? "center" : "left"}
              >
                {username}
              </Typography>
              <Stack
                direction={maxWidth600 ? "column" : "row"}
                mt={2}
                alignItems={maxWidth600 ? "center" : "flex-start"}
              >
                <Tag
                  label={human?.is_human ? "Verified Human" : "Not A Human"}
                  type={human?.is_human ? "blue" : "red"}
                  sx={{ width: "fit-content" }}
                />

                <Tag
                  sx={{
                    ml: maxWidth600 ? 0 : 2,
                    mt: maxWidth600 ? 2 : 0,
                    width: "fit-content",
                  }}
                  label={accountId || ""}
                  removeBg
                  labelSx={{ color: colors.NEUTRAL500 }}
                  leftContent={<CustomAvatar accountId={accountId} size={16} />}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Right */}
          <Stack direction="row" mt={2}>
            <Stack alignItems="center" justifyContent="center">
              <Typography fontSize={36} fontWeight={700} lineHeight="28px">
                {userStamps.length}
              </Typography>
              <Typography>Checks Verified</Typography>
            </Stack>
            <Stack alignItems="center" justifyContent="center" ml={2}>
              <Typography fontSize={36} fontWeight={700} lineHeight="28px">
                {human?.score || 0}
              </Typography>
              <Typography fontSize={17} fontWeight={400} lineHeight="28px">
                Total Score
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* Completed Checks */}
      <GridContainer
        sx={{
          borderRadius: "6px",
          border: "2px solid #f0f0f0",
          p: 2,
          mt: 8,
        }}
        centralize={
          userStamps.length >= 3 || loading || userStamps.length === 0
        }
      >
        {loading ? (
          <CustomCircularProgress />
        ) : (
          <>
            {userStamps.length > 0 ? (
              <StampCards />
            ) : (
              <Stack direction="row" justifyContent="center" p={12}>
                <Typography fontWeight={500}>
                  This user does not have any verified checks
                </Typography>
              </Stack>
            )}
          </>
        )}
      </GridContainer>
    </Container>
  );
}
