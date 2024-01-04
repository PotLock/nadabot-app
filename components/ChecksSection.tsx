import { Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";
import { ShadowContainer } from "./containers/ShadowContainer";
import { AddFilterSearchInput } from "./ui/AddFilterSearchInput";
import { ContactsContainer } from "./containers/ContactsContainer";

type Props = {};

export function ChecksSection(props: Props) {
  return (
    <Stack mt={6}>
      <Typography variant="h4" fontWeight={700}>
        Checks
      </Typography>
      <Typography color={colors.SECONDARY} fontSize={16}>
        Add additional checks for 3rd party providers to become a verified
        human.
      </Typography>

      {/* Checks Container */}
      <ShadowContainer sx={{ mt: 2 }}>
        {/* Search + Add Filter button */}
        <AddFilterSearchInput />
        <ContactsContainer />
      </ShadowContainer>
    </Stack>
  );
}
