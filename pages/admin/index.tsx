import { Container } from "@mui/material";
import { useRouter } from "next/router";

import ProtectedPage from "@nadabot/components/auth/ProtectedPage";
import AdminChecksSection from "@nadabot/components/pages/admin/AdminChecksSection";
import AdminDashboardSection from "@nadabot/components/pages/admin/AdminDashboardSection";
import AdminReviewChecksSection from "@nadabot/components/pages/admin/AdminReviewChecksSection";
import InvitationHeroSection from "@nadabot/components/pages/home/InvitationHeroSection";
import { useUser } from "@nadabot/hooks/store/useUser";
import { Routes } from "@nadabot/routes";

export default function AdminHome() {
  const { isAdmin } = useUser();
  const router = useRouter();

  if (!isAdmin) {
    router.push(Routes.HOME);
  }

  return (
    <ProtectedPage>
      <Container>
        <AdminDashboardSection />
        <AdminChecksSection />
        <AdminReviewChecksSection />
      </Container>
      <InvitationHeroSection />
    </ProtectedPage>
  );
}
