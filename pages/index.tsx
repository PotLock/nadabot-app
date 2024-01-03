import { Container, Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
        {Array(200).fill(<Typography>This is Main</Typography>)}
      </Stack>
    </Container>
  );
}
