import { Container, Stack, Typography } from "@mui/material";
import colors from "@nadabot/theme/colors";

export default function AddStampPage() {
  return (
    <Container>
      <Stack>
        <Typography variant="h4" fontWeight={700}>
          Add Stamp/Check
        </Typography>
        <Typography color={colors.SECONDARY} fontSize={16}>
          A stamp is...
        </Typography>
      </Stack>
    </Container>
  );
}
