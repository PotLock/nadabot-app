import { useAdmins } from "@nadabot/hooks/store/useAdmins";
import { useUser } from "@nadabot/hooks/store/useUser";
import * as contract from "@nadabot/services/web3/contract-interface";
import { walletApi } from "@nadabot/services/web3/web3api";
import { FC, createContext, useCallback, useEffect, useState } from "react";

type Web3AuthProps = {
  accountId: string;
  isWalletConnected: boolean;
  ready: boolean;
  signOut: () => void;
};

export const Web3AuthContext = createContext<Web3AuthProps>({
  accountId: "",
  isWalletConnected: false,
  ready: false,
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
  const {
    initialized: useAdminsInitialized,
    setAdmins,
    admins,
    reset: resetAdminsStore,
  } = useAdmins();

  // Check wallet
  useEffect(() => {
    (async () => {
      // Starts the wallet manager
      await walletApi.initNear();

      setIsConnected(walletApi.walletSelector.isSignedIn());
      isReady(true);

      // update user store
      updateUserInfo({
        accountId: walletApi.accounts[0]?.accountId || "",
        walletConnected: walletApi.walletSelector.isSignedIn(),
      });
    })();
  }, [updateUserInfo]);

  // Store updates
  useEffect(() => {
    (async () => {
      if (isWalletConnected) {
        // useAdmins => set admins
        if (!useAdminsInitialized) {
          const config = await contract.get_config();
          setAdmins(config.admins);
        }

        // useUser => check if user is admin
        updateUserInfo({
          isAdmin: admins.includes(walletApi.accounts[0].accountId || ""),
        });
      }
    })();
  }, [
    isWalletConnected,
    useAdminsInitialized,
    setAdmins,
    admins,
    updateUserInfo,
  ]);

  // Sign out and reset all store states
  const signOut = useCallback(async () => {
    await walletApi.wallet?.signOut();
    resetUserStore();
    resetAdminsStore();

    // Redirects user
    window.location.replace(window.location.origin + window.location.pathname);
  }, [resetAdminsStore, resetUserStore]);

  return (
    <Web3AuthContext.Provider
      value={{
        isWalletConnected,
        ready,
        accountId: walletApi.accounts[0]?.accountId || "",
        signOut,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export default Web3AuthProvider;
