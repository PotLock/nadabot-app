import { Container } from "@mui/material";
import AdminDashboardSection from "@nadabot/components/pages/home/AdminDashboardSection";
import ChecksSection from "@nadabot/components/pages/home/ChecksSection";
import ExploreSection from "@nadabot/components/pages/home/ExploreSection";
import InvitationHeroSection from "@nadabot/components/pages/home/InvitationHeroSection";
import { useUser } from "@nadabot/hooks/store/useUser";

export default function Home() {
  const { isAdmin } = useUser();

  return (
    <>
      <Container>
        {isAdmin ? <AdminDashboardSection /> : <ExploreSection />}
        <ChecksSection />
      </Container>
      <InvitationHeroSection />
    </>
  );
}
