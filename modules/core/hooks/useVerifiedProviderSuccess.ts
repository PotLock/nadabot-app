import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import useSnackbar from "@nadabot/common/ui/utils/snackbar";
import { DIALOGS, useDialogs } from "@nadabot/modules/core/contexts/dialogs";

import useGetProviderById from "./useGetProviderById";

/**
 * Check if there was an verified provider success, if so, show StampDialog with Verified button + Snackbar notification
 */
const useVerifiedProviderSuccess = () => {
  const router = useRouter();
  const { openDialog } = useDialogs();
  const { showSnackbar } = useSnackbar();

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
