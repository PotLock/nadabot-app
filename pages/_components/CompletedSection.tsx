import { Stack, Typography } from "@mui/material";

import insertIsHumanToProvider from "@nadabot/common/lib/insertIsHumanToProvider";
import { useStamps } from "@nadabot/common/store/useStamps";
import colors from "@nadabot/common/ui/colors";
import CustomCircularProgress from "@nadabot/common/ui/components/CustomCircularProgress";
import GridContainer from "@nadabot/common/ui/components/GridContainer";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { StampCard } from "@nadabot/features/stamps/StampCard";

export default function CompletedSection() {
  const { maxWidth805 } = useBreakPoints();
  const { stamps, ready } = useStamps();

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
        {ready ? (
          <GridContainer centralize={stamps.length >= 3}>
            {stamps.map((stamp) => (
              <StampCard
                key={stamp.provider.id}
                providerInfo={insertIsHumanToProvider(stamp.provider)}
                isStamp
              />
            ))}
          </GridContainer>
        ) : (
          <CustomCircularProgress />
        )}
      </ShadowContainer>
    </Stack>
  );
}
