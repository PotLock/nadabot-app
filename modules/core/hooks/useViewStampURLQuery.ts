import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { DIALOGS, useDialogs } from "@nadabot/modules/core/contexts/dialogs";

/**
 * Open up the StampDialog with the required provider_id if "viewStamp=<provider_id>" query is set on URL
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
    if (typeof router.query.viewStamp === "string" && !done) {
      openDialog({
        dialog: DIALOGS.ViewProvider,
        props: { providerId: parseInt(router.query.viewStamp) },
      });

      setDone(true);
    }
  }, [router, openDialog, done]);
};

export default useViewStampURLQuery;