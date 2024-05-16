import { Stack, Typography } from "@mui/material";

import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import ContractsContainer from "@nadabot/pages/_components/stamp/ContractsContainer";

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
        <ContractsContainer inline adminView />
      </ShadowContainer>
    </Stack>
  );
}
