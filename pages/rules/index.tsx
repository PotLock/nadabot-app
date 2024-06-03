import { Container, Stack, Typography } from "@mui/material";

import colors from "@nadabot/common/ui/colors";
import { GroupsOverview } from "@nadabot/modules/groups/components/GroupsOverview";

export default function RulesPage() {
  return (
    <Container sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 2 }}>
      <Stack>
        <Typography fontSize={40} fontWeight={700} lineHeight="48px">
          All Groups
        </Typography>

        <Typography fontSize={16} fontWeight={400} color={colors.SECONDARY}>
          View all active groups & rules
        </Typography>
      </Stack>

      <GroupsOverview />
    </Container>
  );
}
