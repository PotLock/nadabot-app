import { Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import RoundedSearchInput from "./ui/RoundedSearchInput";

type Props = {};

export default function ExploreSection(props: Props) {
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
    </Stack>
  );
}
