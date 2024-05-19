import { Container } from "@mui/material";

import { useUser } from "@nadabot/hooks/store/useUser";
import useCheckPendingVerification from "@nadabot/hooks/useCheckPendingVerification";
import useVerifiedProviderSuccess from "@nadabot/hooks/useVerifiedProviderSuccess";
import useViewStampURLQuery from "@nadabot/hooks/useViewStampURLQuery";

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
