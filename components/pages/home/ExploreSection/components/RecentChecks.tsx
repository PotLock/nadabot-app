import HistoryIcon from "@mui/icons-material/History";
import { Stack, Typography } from "@mui/material";

import { ShadowContainer } from "@nadabot/components/containers/ShadowContainer";
import { useStamps } from "@nadabot/hooks/store/useStamps";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";

import RecentCheckItem from "./RecentCheckItem";

export default function RecentChecks() {
  const { maxWidth1144, maxWidth430 } = useBreakPoints();
  const { stamps } = useStamps();

  return (
    <Stack width={maxWidth1144 ? "100%" : "42%"} mt={4}>
      <ShadowContainer
        sx={{
          display: "flex",
          px: 3,
          py: 5,
          minHeight: 206,
        }}
      >
        <Stack
          direction={maxWidth430 ? "column" : "row"}
          alignItems="center"
          mb={2}
        >
          <HistoryIcon sx={{ width: 28, height: 28, mt: -0.5, mr: 1 }} />
          <Typography
            fontSize={18}
            fontWeight={700}
            lineHeight="normal"
            mr={maxWidth430 ? 0 : 2}
          >
            Recent Checks
          </Typography>
          <Typography
            color={colors.NEUTRAL400}
            lineHeight="normal"
            mr={maxWidth430 ? 0 : 2}
            mt={maxWidth430 ? 0.5 : 0}
          >
            {stamps.length} Total Completed
          </Typography>
        </Stack>

        {/* List - Max 3 items */}
        {stamps.slice(0, 3).map((stamp, index) => (
          <RecentCheckItem
            key={stamp.provider.provider_id}
            totalItems={stamps.length}
            index={index}
            contractName={stamp.provider.name}
            contractId={stamp.provider.contract_id}
            method={stamp.provider.method_name}
            points={stamp.provider.default_weight}
          />
        ))}
      </ShadowContainer>
    </Stack>
  );
}
