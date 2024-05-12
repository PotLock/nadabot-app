import { Stack, Typography } from "@mui/material";

import GridContainer from "@nadabot/components/containers/GridContainer";
import { StampCard } from "@nadabot/components/stamp/StampCard";
import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import { useStamps } from "@nadabot/hooks/store/useStamps";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";
import insertIsHumanToProvider from "@nadabot/utils/insertIsHumanToProvider";

import { ShadowContainer } from "../containers/ShadowContainer";

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
