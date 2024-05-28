import { Container } from "@mui/material";

import useCheckPendingVerification from "@nadabot/modules/core/hooks/useCheckPendingVerification";
import useVerifiedProviderSuccess from "@nadabot/modules/core/hooks/useVerifiedProviderSuccess";
import useViewStampURLQuery from "@nadabot/modules/core/hooks/useViewStampURLQuery";
import { useUser } from "@nadabot/modules/core/store/useUser";

import ChecksSection from "./_components/ChecksSection";
import CompletedSection from "./_components/CompletedSection";
// import InvitationHeroSection from "./_components/sections/InvitationHeroSection";
import ExploreSection from "./_components/ExploreSection";
import PendingVerificationSection from "./_components/PendingVerificationSection";

export default function Home() {
  // Show StampDialog with Verified button + Snackbar notification if user comes back from a `add_stamp` tx
  useVerifiedProviderSuccess();
  // Show StampDialog if the URL has `viewStamp` query
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
