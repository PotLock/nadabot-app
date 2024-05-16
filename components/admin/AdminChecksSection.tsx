import { Stack, Typography } from "@mui/material";

import useBreakPoints from "@nadabot/hooks/useBreakPoints";

import { ShadowContainer } from "../../common/ui/components/ShadowContainer";
import ContractsContainer from "../stamp/ContractsContainer";

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
