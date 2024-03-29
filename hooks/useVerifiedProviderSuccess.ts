import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { DIALOGS } from "@nadabot/contexts/DialogsProvider";

import useDialogs from "./useDialogs";
import useGetProviderById from "./useGetProviderById";
import useSnackbars from "./useSnackbars";

/**
 * Check if there was an verified provider success, if so, show ViewProviderDialog with Verified button + Snackbar notification
 */
const useVerifiedProviderSuccess = () => {
  const router = useRouter();
  const { openDialog } = useDialogs();
  const { showSnackbar } = useSnackbars();
  const [verifiedProviderId, setVerifiedProvider] = useState<number>();
  const provider = useGetProviderById(verifiedProviderId);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (router.query.verifiedProvider) {
      setVerifiedProvider(parseInt(router.query.verifiedProvider as string));
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
        description: `Stamp Verification Complete ${provider.default_weight} Points Recieved`,
      });

      setDone(true);
    }
  }, [router, openDialog, provider, showSnackbar, done]);
};

export default useVerifiedProviderSuccess;
