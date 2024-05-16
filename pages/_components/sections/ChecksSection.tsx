// import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import {
  // useCallback,
  useState,
} from "react";

// import CustomButton from "@nadabot/common/ui/components/CustomButton";
import { AddFilterSearchInput } from "@nadabot/common/ui/components/AddFilterSearchInput";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import colors from "@nadabot/common/ui/theme/colors";
import providerSorts from "@nadabot/common/utils/providerSorts";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
// import { Routes } from "@nadabot/routes";

import ContractsContainer from "../stamp/ContractsContainer";

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
        <ContractsContainer
          searchPattern={searchPattern}
          showLoadingState
          providersList={providers}
        />
      </ShadowContainer>
    </Stack>
  );
}
