import FullScreenSpinner from "@nadabot/components/ui/FullScreenSpinner";
import { useAdmins } from "@nadabot/hooks/store/useAdmins";
import { useConfig } from "@nadabot/hooks/store/useConfig";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import { useUser } from "@nadabot/hooks/store/useUser";
import * as contract from "@nadabot/services/web3/contract-interface";
import { walletApi } from "@nadabot/services/web3/web3api";
import { FC, createContext, useCallback, useEffect, useState } from "react";

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
  const { updateInfo: updateUserInfo, reset: resetUserStore } = useUser();
  const { setAdmins, reset: resetAdminsStore } = useAdmins();
  const { fetchConfig, config, reset: resetConfigStore } = useConfig();
  const { fetchProviders, reset: resetProvidersStore } = useProviders();

  // Init Store
  const initStore = useCallback(async () => {
    if (isWalletConnected) {
      // Config
      await fetchConfig();

      // Providers
      await fetchProviders();

      // App is ready to be shown
      isReady(true);
    }
  }, [isWalletConnected, fetchConfig, fetchProviders]);

  useEffect(() => {
    if (config) {
      // useAdmin
      setAdmins(config.admins);
      // useUser => check if user is admin
      updateUserInfo({
        isAdmin: config.admins.includes(walletApi.accounts[0].accountId || ""),
      });
    }
  }, [config, setAdmins, updateUserInfo]);

  // Check wallet
  useEffect(() => {
    (async () => {
      // Starts the wallet manager
      await walletApi.initNear();

      setIsConnected(walletApi.walletSelector.isSignedIn());

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
    resetUserStore();
    resetAdminsStore();
    resetConfigStore();
    resetProvidersStore();

    // Redirects user
    window.location.replace(window.location.origin + window.location.pathname);
  }, [resetAdminsStore, resetUserStore, resetConfigStore, resetProvidersStore]);

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
