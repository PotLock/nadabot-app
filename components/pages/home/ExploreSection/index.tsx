import { Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import RoundedSearchInput from "../../../ui/RoundedSearchInput";
import MyHumanityScore from "./components/MyHumanityScore";
import RecentChecks from "./components/RecentChecks";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";

export default function ExploreSection() {
  const { maxWidth1144 } = useBreakPoints();

  return (
    <Stack>
      <Typography variant="h4" fontWeight={700}>
        Explore
      </Typography>
      <Typography color={colors.SECONDARY} fontSize={16}>
        Check whether someone is human or not.
      </Typography>
      <RoundedSearchInput
        placeholder="Enter a username"
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
