import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import { DIALOGS } from "@nadabot/pages/_components/types";

import useDialogs from "./useDialogs";
import useGetProviderById from "./useGetProviderById";
import useSnackbars from "./useSnackbars";

/**
 * Check if there was an verified provider success, if so, show StampDialog with Verified button + Snackbar notification
 */
const useVerifiedProviderSuccess = () => {
  const router = useRouter();
  const { openDialog } = useDialogs();
  const { showSnackbar } = useSnackbars();

  const [verifiedProviderId, setVerifiedProvider] = useState<ProviderId>(0);

  const provider = useGetProviderById(verifiedProviderId);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof router.query.verifiedProvider === "string") {
      setVerifiedProvider(parseInt(router.query.verifiedProvider));
    }
  }, [router]);

  useEffect(() => {
    if (provider && !done) {
      openDialog({
        dialog: DIALOGS.ViewProvider,
        props: { providerId: provider.id },
      });

      showSnackbar({
        bgColor: "blue",
        description: `Stamp Verification Complete ${provider.default_weight} Points Received`,
      });

      setDone(true);
    }
  }, [router, openDialog, provider, showSnackbar, done]);
};

export default useVerifiedProviderSuccess;
