import { Container } from "@mui/material";
import { ChecksSection } from "@nadabot/components/ChecksSection";
import { ExploreSection } from "@nadabot/components/ExploreSection";

export default function Home() {
  return (
    <Container>
      <ExploreSection />
      <ChecksSection />
    </Container>
  );
}
