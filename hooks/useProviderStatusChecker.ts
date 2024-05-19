import { useCallback } from "react";

import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

import useFilteredProviders from "./useFilteredProviders";
import { useUser } from "../common/store/useUser";

export const PROVIDER_STATUS_CHECKER_KEY = "provider_status_checker";

/**
 * This hook should be used to detect when a provider in which the user "Got Checked" added the user as a human.
 * @returns
 */
const useProviderStatusChecker = () => {
  const { walletConnected } = useUser();
  const { activeIsHuman } = useFilteredProviders({});

  const saveProvider = useCallback(
    (providerId: ProviderId) => {
      if (walletConnected) {
        localStorage.setItem(
          PROVIDER_STATUS_CHECKER_KEY,
          providerId.toString(),
        );
      }
    },
    [walletConnected],
  );

  const checkProvider = useCallback(() => {
    const providerId = parseInt(
      localStorage.getItem(PROVIDER_STATUS_CHECKER_KEY) ?? "0",
    );

    let isHuman = false;

    if (providerId && activeIsHuman.length > 0) {
      const foundStamp = activeIsHuman.find(
        (provider) => provider.id === providerId,
      );

      isHuman = (foundStamp && foundStamp.is_user_a_human) || false;
    }

    if (isHuman) {
      // clean up storage
      localStorage.removeItem(PROVIDER_STATUS_CHECKER_KEY);
    }

    return {
      isHuman,
      providerId,
    };
  }, [activeIsHuman]);

  return {
    /**
     * On click "Get Check", Save providerId to check if user is now a human within the provider contract
     */
    saveProvider,
    /**
     * Check if user is a human within the provider contract stored before
     * @returns
     */
    checkProvider,
  };
};

export default useProviderStatusChecker;
