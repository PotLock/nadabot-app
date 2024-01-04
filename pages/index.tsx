import { Container } from "@mui/material";
import ChecksSection from "@nadabot/components/ChecksSection";
import ExploreSection from "@nadabot/components/ExploreSection";
import InvitationHeroSection from "@nadabot/components/InvitationHeroSection";

export default function Home() {
  return (
    <>
      <Container>
        <ExploreSection />
        <ChecksSection />
      </Container>
      <InvitationHeroSection />
    </>
  );
}
