import { Container } from "@mui/material";
import { useRouter } from "next/router";

import { Routes } from "@nadabot/common/constants";
import { useUser } from "@nadabot/hooks/store/useUser";
import ProtectedPage from "@nadabot/pages/_components/auth/ProtectedPage";

import AdminChecksSection from "./_components/AdminChecksSection";
import AdminDashboardSection from "./_components/AdminDashboardSection";
import AdminReviewChecksSection from "./_components/AdminReviewChecksSection";
import InvitationHeroSection from "../_components/InvitationHeroSection";

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
