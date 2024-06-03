import { Container } from "@mui/material";
import { useRouter } from "next/router";

import { Routes } from "@nadabot/common/constants";
import ProtectedPage from "@nadabot/modules/auth/components/ProtectedPage";
import { useUser } from "@nadabot/modules/core/store/useUser";

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
