import { Stack, Typography } from "@mui/material";

import colors from "@nadabot/common/ui/colors";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { useUser } from "@nadabot/modules/core/store/useUser";

import MyHumanityScore from "./MyHumanityScore";
import RecentChecks from "./RecentChecks";
import RoundedSearchInput from "./RoundedSearchInput";

export default function ExploreSection() {
  const { maxWidth1144 } = useBreakPoints();
  const { walletConnected } = useUser();

  const UserScoreStampInfo = () => (
    <Stack
      direction={maxWidth1144 ? "column" : "row"}
      justifyContent="space-between"
      alignItems={maxWidth1144 ? "center" : "flex-start"}
    >
      {/* My Humanity Score */}
      <MyHumanityScore />
      {/* Recent Checks */}
      <RecentChecks />
    </Stack>
  );

  return (
    <Stack>
      <div id="explore" />
      <Typography variant="h4" fontWeight={700}>
        Explore
      </Typography>
      <Typography color={colors.SECONDARY} fontSize={16}>
        Check whether someone is human or not.
      </Typography>
      <RoundedSearchInput
        placeholder="Enter an account id"
        enableShadow
        sx={{ mt: 2 }}
      />

      {walletConnected && <UserScoreStampInfo />}
    </Stack>
  );
}
