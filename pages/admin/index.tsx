import { Container } from "@mui/material";
import { useRouter } from "next/router";

import AdminChecksSection from "@nadabot/components/admin/AdminChecksSection";
import AdminDashboardSection from "@nadabot/components/admin/AdminDashboardSection";
import AdminReviewChecksSection from "@nadabot/components/admin/AdminReviewChecksSection";
import ProtectedPage from "@nadabot/components/auth/ProtectedPage";
import InvitationHeroSection from "@nadabot/components/home/InvitationHeroSection";
import { useUser } from "@nadabot/hooks/store/useUser";
import { Routes } from "@nadabot/routes";

export default function AdminHome() {
  const { isAdmin } = useUser();
  const router = useRouter();

  if (!isAdmin) {
    router.push(Routes.HOME);
    return;
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
