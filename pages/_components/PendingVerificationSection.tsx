import { Stack, Typography } from "@mui/material";
import { useCallback } from "react";

import addMultipleStamps from "@nadabot/common/services/web3/addMultipleStamps";
import colors from "@nadabot/common/ui/colors";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import CustomCircularProgress from "@nadabot/common/ui/components/CustomCircularProgress";
import GridContainer from "@nadabot/common/ui/components/GridContainer";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import useBreakPoints from "@nadabot/common/ui/lib/useBreakPoints";
import useSpinner from "@nadabot/common/ui/lib/useSpinner";
import providerSorts from "@nadabot/common/utils/providerSorts";
import { useUser } from "@nadabot/hooks/store/useUser";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import { StampCard } from "@nadabot/pages/_components/stamps/StampCard";

export default function PendingVerificationSection() {
  const { walletConnected } = useUser();
  const { maxWidth805 } = useBreakPoints();
  const { showSpinner, hideSpinner } = useSpinner();
  const { activeIsHuman, ready } = useFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });

  const hasProviders = activeIsHuman.length > 0;

  const Cards = useCallback(
    () => (
      <GridContainer centralize={activeIsHuman.length >= 3}>
        {activeIsHuman.map((provider) => (
          <StampCard
            key={provider.id}
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

  const verifyAllHandler = useCallback(async () => {
    showSpinner();
    await addMultipleStamps(activeIsHuman);
    hideSpinner();
  }, [activeIsHuman, showSpinner, hideSpinner]);

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

        {activeIsHuman.length > 1 && (
          <CustomButton
            sx={{
              mt: maxWidth805 ? 1 : 0,
              backgroundColor: colors.PRIMARY,
              color: "#FFFFFF",
              ":hover": { backgroundColor: "#5c5c5c" },
            }}
            bodySize="medium"
            onClick={verifyAllHandler}
          >
            Verify All Checks
          </CustomButton>
        )}
      </Stack>

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        {ready ? <Cards /> : <CustomCircularProgress />}
      </ShadowContainer>
    </Stack>
  );
}
