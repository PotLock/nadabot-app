import { useCallback, useEffect } from "react";

import { DIALOGS } from "@nadabot/contexts/DialogsProvider";

import useDialogs from "./useDialogs";
import useProviderStatusChecker from "./useProviderStatusChecker";
import useWindowTabFocus from "./useWindowTabFocus";

/**
 * Detect when a provider in which the user "Got Checked" added the user as a human.
 */
const useCheckPendingVerification = () => {
  const { checkProvider } = useProviderStatusChecker();
  const { openDialog } = useDialogs();

  const checkIfUserHasNewVerification = useCallback(() => {
    const providerCheckInfo = checkProvider();
    const wasUserAddedAsHuman = providerCheckInfo.isHuman;
    if (wasUserAddedAsHuman && providerCheckInfo.providerId) {
      openDialog({
        dialog: DIALOGS.ConfirmVerification,
        props: { providerId: providerCheckInfo.providerId },
      });
      return;
    }
  }, [checkProvider, openDialog]);

  useEffect(() => {
    checkIfUserHasNewVerification();
  }, [checkIfUserHasNewVerification]);

  // When user comes back to home page, check if user has new verification
  useWindowTabFocus(checkIfUserHasNewVerification);
};

export default useCheckPendingVerification;
