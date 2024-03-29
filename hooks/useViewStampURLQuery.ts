import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { DIALOGS } from "@nadabot/contexts/DialogsProvider";

import useDialogs from "./useDialogs";

/**
 * Open up the ViewProviderDialog with the required provider_id if "viewStamp=<provider_id>" query is set on URL
 */
const useViewStampURLQuery = () => {
  const router = useRouter();
  const { openDialog, currentDialog } = useDialogs();
  const [done, setDone] = useState(currentDialog === DIALOGS.ViewProvider);

  useEffect(() => {
    if (!done && currentDialog === DIALOGS.ViewProvider) {
      setDone(true);
    }
  }, [currentDialog, done]);

  useEffect(() => {
    if (router.query.viewStamp && !done) {
      openDialog({
        dialog: DIALOGS.ViewProvider,
        props: { providerId: parseInt(router.query.viewStamp as string) },
      });

      setDone(true);
    }
  }, [router, openDialog, done]);
};

export default useViewStampURLQuery;
