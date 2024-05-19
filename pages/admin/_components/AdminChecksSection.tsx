import { Stack, Typography } from "@mui/material";

import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import StampsOverview from "@nadabot/features/stamps/StampsOverview";

export default function AdminChecksSection() {
  const { maxWidth805 } = useBreakPoints();

  return (
    <Stack mt={6}>
      <Stack
        direction={maxWidth805 ? "column" : "row"}
        justifyContent="space-between"
        alignItems={maxWidth805 ? "flex-start" : "center"}
      >
        <Stack>
          <Typography variant="h4" fontWeight={700}>
            Checks that Need your Approval
          </Typography>
        </Stack>
      </Stack>

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        <StampsOverview inline adminView />
      </ShadowContainer>
    </Stack>
  );
}
