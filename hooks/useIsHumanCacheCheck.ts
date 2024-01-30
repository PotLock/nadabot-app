import { getContractApi } from "@wpdas/naxios";
import { useCallback, useEffect, useState } from "react";

import { NETWORK } from "@nadabot/services/web3/constants";
import {
  isHumanCache,
  isHumanCacheUpdatedObservable,
} from "@nadabot/utils/isHumanCacheObservable";

import { useUser } from "./store/useUser";

/**
 * This should be used to use cached IS_HUMAN verification for each user within a provider. Each data is valid for a minimum of 1 minute.
 * @param providerId
 * @param contractId
 * @param method
 * @returns
 */
const useIsHumanCacheCheck = (
  providerId?: string,
  contractId?: string,
  method?: string,
  isPreview?: boolean,
) => {
  const { accountId } = useUser();
  const [ready, isReady] = useState(false);
  const [isHuman, setIsHuman] = useState(isPreview ? true : false);

  /**
   * Fetch a new verification to determine if it isHuman
   */
  const verify = useCallback(async () => {
    if (providerId && contractId && method && accountId) {
      // New contract instance
      const providerContract = await getContractApi({
        contractId: contractId,
        network: NETWORK,
      });

      // View call to check if account_id is human
      const isHuman = await providerContract.view<{}, boolean>(method, {
        args: { account_id: accountId },
      });

      // Update the isHuman state
      setIsHuman(isHuman);

      // Cache info for this provider id
      isHumanCache[providerId] = {
        // 1 min from the "Date.now()"" date
        expiresAt: Date.now() + 1 * 60 * 1000,
        isHuman,
      };

      // Call observable to persist new data
      isHumanCacheUpdatedObservable.notify(isHumanCache);

      return isHuman;
    }
    return false;
  }, [accountId, providerId, contractId, method]);

  useEffect(() => {
    if (providerId && contractId && method && accountId && !isPreview) {
      // Check if the previous data is still valid (withing the interval)
      const cached = isHumanCache[providerId];

      // If there's cache and it's not expired
      if (cached && Date.now() < cached.expiresAt) {
        // Use cached info
        setIsHuman(cached.isHuman);
        isReady(true);
      } else {
        // If cache non existent or expired
        (async () => {
          // New contract instance
          const providerContract = await getContractApi({
            contractId: contractId,
            network: NETWORK,
          });

          // View call to check if account_id is human
          const isHuman = await providerContract.view<{}, boolean>(method, {
            args: { account_id: accountId },
          });

          setIsHuman(isHuman);

          // Cache info for this provider id
          isHumanCache[providerId] = {
            // 1 min from the "Date.now()"" date
            expiresAt: Date.now() + 1 * 60 * 1000,
            isHuman,
          };

          // Call observable to persist new data
          isHumanCacheUpdatedObservable.notify(isHumanCache);

          // Set ready state
          isReady(true);
        })();
      }
    } else {
      isReady(true);
    }
  }, [accountId, providerId, contractId, method, isPreview]);

  return { isHuman, ready, verify };
};

export default useIsHumanCacheCheck;
