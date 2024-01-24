import { Stack, Typography } from "@mui/material";

import ContractInfo from "@nadabot/components/ContractInfo";
import { useStamps } from "@nadabot/hooks/store/useStamps";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";

import { ShadowContainer } from "../../containers/ShadowContainer";

export default function CompletedSection() {
  const { isAdmin } = useUser();
  const { maxWidth805 } = useBreakPoints();
  const { stamps } = useStamps();

  if (stamps.length === 0) {
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
            Completed
          </Typography>

          <Typography color={colors.SECONDARY} fontSize={16}>
            Stamps you have completed that are already contributing to your
            score.
          </Typography>
        </Stack>
      </Stack>

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        <Stack
          mt={isAdmin ? 0 : 2}
          direction="row"
          justifyContent={maxWidth805 ? "center" : "space-between"}
          gap={2}
          flexWrap="wrap"
        >
          {stamps.map((stamp) => (
            <ContractInfo
              key={stamp.provider.provider_id}
              providerInfo={stamp.provider}
              isStamp
            />
          ))}
        </Stack>
      </ShadowContainer>
    </Stack>
  );
}
