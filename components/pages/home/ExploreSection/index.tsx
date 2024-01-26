import { Stack, Typography } from "@mui/material";

import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";

import MyHumanityScore from "./components/MyHumanityScore";
import RecentChecks from "./components/RecentChecks";
import RoundedSearchInput from "../../../ui/RoundedSearchInput";

export default function ExploreSection() {
  const { maxWidth1144 } = useBreakPoints();

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
    </Stack>
  );
}
