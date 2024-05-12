import { Stack, Typography } from "@mui/material";

import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";

import MyHumanityScore from "./components/MyHumanityScore";
import RecentChecks from "./components/RecentChecks";
import RoundedSearchInput from "../../ui/RoundedSearchInput";

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
