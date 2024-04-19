import { Container } from "@mui/material";

import ChecksSection from "@nadabot/components/pages/home/ChecksSection";
import CompletedSection from "@nadabot/components/pages/home/CompletedSection";
import ExploreSection from "@nadabot/components/pages/home/ExploreSection";
// import InvitationHeroSection from "@nadabot/components/pages/home/InvitationHeroSection";
import PendingVerificationSection from "@nadabot/components/pages/home/PendingVerificationSection";
import { useUser } from "@nadabot/hooks/store/useUser";
import useCheckPendingVerification from "@nadabot/hooks/useCheckPendingVerification";
import useVerifiedProviderSuccess from "@nadabot/hooks/useVerifiedProviderSuccess";
import useViewStampURLQuery from "@nadabot/hooks/useViewStampURLQuery";

export default function Home() {
  // Show ViewProviderDialog with Verified button + Snackbar notification if user comes back from a `add_stamp` tx
  useVerifiedProviderSuccess();
  // Show ViewProviderDialog if the URL has `viewStamp` query
  useViewStampURLQuery();
  // Detect when a provider in which the user "Got Checked" added the user as a human.
  useCheckPendingVerification();

  const { walletConnected } = useUser();

  return (
    <>
      <Container
        sx={{
          paddingBottom: "3rem",
        }}
      >
        <ExploreSection />
        <PendingVerificationSection />
        <ChecksSection />
        {walletConnected && <CompletedSection />}
      </Container>
      {/* <InvitationHeroSection /> */}
    </>
  );
}
