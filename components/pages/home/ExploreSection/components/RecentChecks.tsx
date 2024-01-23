import HistoryIcon from "@mui/icons-material/History";
import { Stack, Typography } from "@mui/material";

import { ShadowContainer } from "@nadabot/components/containers/ShadowContainer";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";

import RecentCheckItem from "./RecentCheckItem";

export default function RecentChecks() {
  const { maxWidth1144, maxWidth430 } = useBreakPoints();

  // TODO: Fake for now. should use real data
  const totalCompleted = 16;

  return (
    <Stack width={maxWidth1144 ? "100%" : "42%"} mt={4}>
      <ShadowContainer
        sx={{
          display: "flex",
          px: 3,
          py: 5,
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
            {totalCompleted} Total Completed
          </Typography>
        </Stack>

        {/* List - Max 3 items */}
        <RecentCheckItem
          totalItems={3}
          index={0}
          contractName={""}
          contractId={""}
          method={""}
          points={0}
        />
        <RecentCheckItem
          totalItems={3}
          index={1}
          contractName={""}
          contractId={""}
          method={""}
          points={0}
        />
        <RecentCheckItem
          totalItems={3}
          index={2}
          contractName={""}
          contractId={""}
          method={""}
          points={0}
        />
      </ShadowContainer>
    </Stack>
  );
}
