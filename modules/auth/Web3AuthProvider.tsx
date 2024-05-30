import { useRouter } from "next/router";
import { FC, createContext, useCallback, useEffect, useState } from "react";

import { walletApi } from "@nadabot/common/services/contracts";
import { get_user_profile } from "@nadabot/common/services/contracts/social";
import FullScreenSpinner from "@nadabot/common/ui/components/FullScreenSpinner";
import useWindowTabFocus from "@nadabot/common/ui/utils/useWindowTabFocus";
import { PROVIDER_STATUS_CHECKER_KEY } from "@nadabot/modules/core/hooks/useProviderStatusChecker";
import { useAdmins } from "@nadabot/modules/core/store/useAdmins";
import { useConfig } from "@nadabot/modules/core/store/useConfig";
import { useNotificationController } from "@nadabot/modules/core/store/useNotificationController";
import { useProviders } from "@nadabot/modules/core/store/useProviders";
import { useStamps } from "@nadabot/modules/core/store/useStamps";
import { useUser } from "@nadabot/modules/core/store/useUser";

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
  const router = useRouter();
  const [isWalletConnected, setIsConnected] = useState(false);
  const [ready, isReady] = useState(false);

  // Store: Check store and initial contract's data
  const { updateInfo: updateUserInfo, accountId, reset: resetUser } = useUser();
  const { setAdmins, reset: resetAdmins } = useAdmins();
  const { fetchConfig, reset: resetConfig } = useConfig();
  const { fetchProviders, reset: resetProviders } = useProviders();
  const { fetchStamps, reset: resetStamps } = useStamps();
  const { registerLoginTime, reset: resetNotifications } =
    useNotificationController();

  // Init Store
  const initStore = useCallback(async () => {
    // Config
    const _config = await fetchConfig();

    // useAdmin
    setAdmins(_config.admins);

    // Providers
    await fetchProviders();

    if (accountId) {
      // get user profile info from NEAR Social DB
      const profileInfo = await get_user_profile({ accountId });

      // useUser => check if user is admin + set user profile info
      updateUserInfo({
        isAdmin: _config.admins.includes(walletApi.accountId || ""),

        profileInfo,
      });

      // Stamps
      const _stamps = await fetchStamps(accountId);

      // Calculation to check if user is a verified human or not
      let userStampsSum = 0;
      _stamps.forEach((stamp) => {
        userStampsSum += stamp.provider.default_weight;
      });

      // useUser => update isHuman state
      updateUserInfo({
        isVerifiedHuman: userStampsSum >= _config.default_human_threshold,
        score: userStampsSum || 0,
      });
    }

    // App is ready to be shown
    isReady(true);
  }, [
    fetchConfig,
    fetchProviders,
    fetchStamps,
    accountId,
    updateUserInfo,
    setAdmins,
  ]);

  // Re-fetch config, providers and stamps when the window tab is focused
  const reFetch = useCallback(() => {
    if (ready && accountId) {
      initStore();
    }
  }, [initStore, ready, accountId]);
  useWindowTabFocus(reFetch);

  // Check wallet
  const walletInit = useCallback(async () => {
    // Starts the wallet manager
    await walletApi.initNear();

    const isSignedIn = walletApi.walletSelector.isSignedIn();
    setIsConnected(isSignedIn);

    if (isSignedIn) {
      registerLoginTime();
    }

    // update user store
    updateUserInfo({
      accountId: walletApi.accountId || "",
      walletConnected: isSignedIn,
    });

    // Initializes the store
    await initStore();
  }, [updateUserInfo, initStore, registerLoginTime]);

  // Re-init when user is signed in
  useEffect(() => {
    walletInit();
    walletApi?.walletSelector?.on("signedIn", walletInit);

    return () => {
      walletApi?.walletSelector?.off("signedIn", walletInit);
    };
  }, [walletInit, initStore, router]);

  // Logout handler
  useEffect(() => {
    const signedOutHandler = () => {
      localStorage?.removeItem(PROVIDER_STATUS_CHECKER_KEY);
      setIsConnected(false);
      resetUser();
      resetAdmins();
      resetConfig();
      resetProviders();
      resetStamps();
      resetNotifications();
      router.reload();
    };

    walletApi.walletSelector?.on("signedOut", signedOutHandler);

    return () => {
      walletApi.walletSelector.off("signedOut", signedOutHandler);
    };
  }, [
    resetUser,
    resetAdmins,
    resetConfig,
    resetProviders,
    resetStamps,
    resetNotifications,
    router,
  ]);

  // Sign out and reset all store states
  const signOut = useCallback(async () => {
    await walletApi.wallet?.signOut();
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