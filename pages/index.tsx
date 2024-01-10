import { Container } from "@mui/material";
import ChecksSection from "@nadabot/components/pages/home/ChecksSection";
import ExploreSection from "@nadabot/components/pages/home/ExploreSection";
import InvitationHeroSection from "@nadabot/components/pages/home/InvitationHeroSection";

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
