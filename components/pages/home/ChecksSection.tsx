import { useCallback, useState } from "react";
import { Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import { useRouter } from "next/router";
import { ShadowContainer } from "../../containers/ShadowContainer";
import { AddFilterSearchInput } from "../../ui/AddFilterSearchInput";
import ContractsContainer from "../../containers/ContractsContainer";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import CustomButton from "@nadabot/components/ui/CustomButton";
import { Routes } from "@nadabot/routes";

export default function ChecksSection() {
  const router = useRouter();
  const { isAdmin, walletConnected } = useUser();
  const { maxWidth805, maxWidth430 } = useBreakPoints();
  const [searchPattern, setSearchPattern] = useState("");

  const addCustomCheckHandler = useCallback(() => {
    router.push(Routes.ADD_STAMP);
  }, [router]);

  return (
    <Stack mt={6}>
      <Stack
        direction={maxWidth805 ? "column" : "row"}
        justifyContent="space-between"
        alignItems={maxWidth805 ? "flex-start" : "center"}
      >
        <Stack>
          <Typography variant="h4" fontWeight={700}>
            {isAdmin ? "Checks that Need your Approval" : "Checks"}
          </Typography>

          {!isAdmin && (
            <Typography color={colors.SECONDARY} fontSize={16}>
              Add additional checks for 3rd party providers to become a verified
              human.
            </Typography>
          )}
        </Stack>
        {!isAdmin && walletConnected && (
          <CustomButton
            sx={{ mt: maxWidth805 ? 1 : 0 }}
            bodySize="medium"
            color="blue"
            onClick={addCustomCheckHandler}
          >
            + Add Custom Check
          </CustomButton>
        )}
      </Stack>

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        {/* Search + Add Filter button */}
        <>
          {!isAdmin && (
            <AddFilterSearchInput
              onChange={(text) => setSearchPattern(text)}
              hideAddFilterButton
            />
          )}
        </>
        {isAdmin && !maxWidth430 ? (
          <ContractsContainer inline={isAdmin ? true : false} />
        ) : (
          <ContractsContainer searchPattern={searchPattern} />
        )}
      </ShadowContainer>
    </Stack>
  );
}
