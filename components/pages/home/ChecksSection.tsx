import { Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import { ShadowContainer } from "../../containers/ShadowContainer";
import { AddFilterSearchInput } from "../../ui/AddFilterSearchInput";
import ContractsContainer from "../../containers/ContractsContainer";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";

export default function ChecksSection() {
  const { isAdmin } = useUser();
  const { maxWidth430 } = useBreakPoints();

  return (
    <Stack mt={6}>
      <Typography variant="h4" fontWeight={700}>
        {isAdmin ? "Checks that Need your Approval" : "Checks"}
      </Typography>

      {!isAdmin && (
        <Typography color={colors.SECONDARY} fontSize={16}>
          Add additional checks for 3rd party providers to become a verified
          human.
        </Typography>
      )}

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        {/* Search + Add Filter button */}
        <>{!isAdmin && <AddFilterSearchInput />}</>
        {isAdmin && !maxWidth430 ? (
          <ContractsContainer inline={isAdmin ? true : false} />
        ) : (
          <ContractsContainer />
        )}
      </ShadowContainer>
    </Stack>
  );
}
