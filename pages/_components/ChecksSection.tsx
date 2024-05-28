// import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import {
  // useCallback,
  useState,
} from "react";

// import CustomButton from "@nadabot/common/ui/components/CustomButton";
import providerSorts from "@nadabot/common/lib/providerSorts";
import colors from "@nadabot/common/ui/colors";
import { AddFilterSearchInput } from "@nadabot/common/ui/components/AddFilterSearchInput";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import useFilteredProviders from "@nadabot/modules/core/hooks/useFilteredProviders";
import { useUser } from "@nadabot/modules/core/store/useUser";
import StampsOverview from "@nadabot/modules/stamps/StampsOverview";
// import { Routes } from "@nadabot/common/constants";

export default function ChecksSection() {
  // const router = useRouter();
  const { walletConnected } = useUser();
  const { maxWidth805 } = useBreakPoints();
  const [searchPattern, setSearchPattern] = useState("");
  const { activeNoHuman, active } = useFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });

  // const addCustomCheckHandler = useCallback(() => {
  //   router.push(Routes.ADD_STAMP);
  // }, [router]);

  const providers =
    walletConnected && activeNoHuman.length > 0 ? activeNoHuman : active;

  const hasProviders = providers.length > 0;

  return (
    <Stack mt={6}>
      <Stack
        direction={maxWidth805 ? "column" : "row"}
        justifyContent="space-between"
        alignItems={maxWidth805 ? "flex-start" : "center"}
      >
        <Stack>
          <Typography variant="h4" fontWeight={700}>
            Checks
          </Typography>

          <Typography color={colors.SECONDARY} fontSize={16}>
            Add additional checks for 3rd party providers to become a verified
            human.
          </Typography>
        </Stack>
        {/* {walletConnected && (
          <CustomButton
            sx={{ mt: maxWidth805 ? 1 : 0 }}
            bodySize="medium"
            color="blue"
            onClick={addCustomCheckHandler}
          >
            + Add Custom Check
          </CustomButton>
        )} */}
      </Stack>

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        {/* Search + Add Filter button */}
        <>
          {hasProviders && (
            <AddFilterSearchInput
              onChange={(text) => setSearchPattern(text)}
              hideAddFilterButton
            />
          )}
        </>
        <StampsOverview
          searchPattern={searchPattern}
          showLoadingState
          providersList={providers}
        />
      </ShadowContainer>
    </Stack>
  );
}
