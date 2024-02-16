import { Stack, Typography } from "@mui/material";
import { useCallback } from "react";

import GridContainer from "@nadabot/components/containers/GridContainer";
import ContractInfo from "@nadabot/components/ContractInfo";
import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import colors from "@nadabot/theme/colors";
import providerSorts from "@nadabot/utils/providerSorts";

import { ShadowContainer } from "../../containers/ShadowContainer";

export default function PendingVerificationSection() {
  const { walletConnected } = useUser();
  const { maxWidth805 } = useBreakPoints();
  const { activeIsHuman, ready } = useFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });

  const hasProviders = activeIsHuman.length > 0;

  const Cards = useCallback(
    () => (
      <GridContainer centralize={activeIsHuman.length >= 3}>
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
      </GridContainer>
    ),
    [activeIsHuman],
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
