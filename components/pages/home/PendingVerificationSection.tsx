import { Stack, Typography } from "@mui/material";
import { useCallback } from "react";

import ContractInfo from "@nadabot/components/ContractInfo";
import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useIsHumanFilteredProviders from "@nadabot/hooks/useIsHumanFilteredProviders";
import colors from "@nadabot/theme/colors";

import { ShadowContainer } from "../../containers/ShadowContainer";

export default function PendingVerificationSection() {
  const { walletConnected } = useUser();
  const { maxWidth805 } = useBreakPoints();
  const { activeIsHuman, ready } = useIsHumanFilteredProviders();

  const hasProviders = activeIsHuman.length > 0;

  const Cards = useCallback(
    () => (
      <Stack
        mt={2}
        direction="row"
        justifyContent={maxWidth805 ? "center" : "space-between"}
        gap={2}
        flexWrap="wrap"
        overflow="scroll"
      >
        {activeIsHuman.map((provider) => (
          <ContractInfo
            key={provider.provider_id}
            providerInfo={provider}
            verifyButtonSx={{
              background: colors.PRIMARY,
              color: colors.WHITE,
              ":hover": { background: "#515151" },
            }}
          />
        ))}
      </Stack>
    ),
    [activeIsHuman, maxWidth805],
  );

  if (!walletConnected || !hasProviders) {
    return;
  }

  return (
    <Stack mt={6}>
      <Stack
        direction={maxWidth805 ? "column" : "row"}
        justifyContent="space-between"
        alignItems={maxWidth805 ? "flex-start" : "center"}
      >
        <Stack>
          <Typography variant="h4" fontWeight={700}>
            Pending Verification
          </Typography>

          <Typography color={colors.SECONDARY} fontSize={16}>
            Stamps you have completed but are not verified on the platform
          </Typography>
        </Stack>
      </Stack>

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        {ready ? <Cards /> : <CustomCircularProgress />}
      </ShadowContainer>
    </Stack>
  );
}
