import { FC, createContext, useCallback, useEffect, useState } from "react";

import FullScreenSpinner from "@nadabot/components/ui/FullScreenSpinner";
import { useAdmins } from "@nadabot/hooks/store/useAdmins";
import { useConfig } from "@nadabot/hooks/store/useConfig";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import { useStamps } from "@nadabot/hooks/store/useStamps";
import { useUser } from "@nadabot/hooks/store/useUser";
import useWindowTabFocus from "@nadabot/hooks/useWindowTabFocus";
import { get_user_profile } from "@nadabot/services/web3/social-db-interface";
import { walletApi } from "@nadabot/services/web3/web3api";

type Web3AuthProps = {
  accountId: string;
  isWalletConnected: boolean;
  signOut: () => void;
};

export const Web3AuthContext = createContext<Web3AuthProps>({
  accountId: "",
  isWalletConnected: false,
  signOut: () => {
    throw new Error("signOut must be defined");
  },
});

type Props = {
  children: JSX.Element;
};

/**
 * Provider to check and inform if user's wallet is connected
 */
const Web3AuthProvider: FC<Props> = ({ children }) => {
  const [isWalletConnected, setIsConnected] = useState(false);
  const [ready, isReady] = useState(false);

  // Store: Check store and initial contract's data
  const { updateInfo: updateUserInfo, accountId } = useUser();
  const { setAdmins } = useAdmins();
  const { fetchConfig, config } = useConfig();
  const { fetchProviders } = useProviders();
  const { fetchStamps } = useStamps();

  // Init Store
  const initStore = useCallback(async () => {
    // Config
    const _config = await fetchConfig();

    // Providers
    await fetchProviders();

    if (accountId) {
      // Stamps
      const _stamps = await fetchStamps(accountId);

      // Calculation to check if user is a verified human or not
      let userStampsSum = 0;
      _stamps.forEach((stamp) => {
        userStampsSum += stamp.provider.default_weight;
      });

      const userStampsAvarageScore = userStampsSum / _stamps.length;

      // useUser => update isHuman state
      updateUserInfo({
        isVerifiedHuman:
          userStampsAvarageScore >= _config.default_human_threshold,
        score: userStampsAvarageScore || 0,
      });
    }

    // App is ready to be shown
    isReady(true);
  }, [fetchConfig, fetchProviders, fetchStamps, accountId, updateUserInfo]);

  // Re-fetch config, providers and stamps when the window tab is focused
  const reFetch = useCallback(() => {
    if (ready && accountId) {
      initStore();
    }
  }, [initStore, ready, accountId]);
  useWindowTabFocus(reFetch);

  useEffect(() => {
    if (config && walletApi.accounts[0]) {
      (async () => {
        // useAdmin
        setAdmins(config.admins);

        const _accountId = walletApi.accounts[0].accountId;

        // get user profile info from NEAR Social DB
        const profileInfo = await get_user_profile({ accountId: _accountId });

        // useUser => check if user is admin + set user profile info
        updateUserInfo({
          isAdmin: config.admins.includes(
            walletApi.accounts[0].accountId || "",
          ),

          profileInfo,
        });
      })();
    }
  }, [config, setAdmins, updateUserInfo]);

  // Check wallet
  useEffect(() => {
    (async () => {
      // Starts the wallet manager
      await walletApi.initNear();

      const isSignedIn = walletApi.walletSelector.isSignedIn();
      setIsConnected(isSignedIn);

      // update user store
      updateUserInfo({
        accountId: walletApi.accounts[0]?.accountId || "",
        walletConnected: walletApi.walletSelector.isSignedIn(),
      });

      // Initializes the store
      await initStore();
    })();
  }, [updateUserInfo, initStore]);

  // Sign out and reset all store states
  const signOut = useCallback(async () => {
    await walletApi.wallet?.signOut();
    localStorage.clear();

    // Redirects user
    window.location.replace(window.location.origin + window.location.pathname);
  }, []);

  if (!ready) {
    return <FullScreenSpinner />;
  }

  return (
    <Web3AuthContext.Provider
      value={{
        isWalletConnected,
        accountId: walletApi.accounts[0]?.accountId || "",
        signOut,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export default Web3AuthProvider;
