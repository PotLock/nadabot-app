import { wallet } from "@nadabot/services/web3";
import { FC, createContext, useEffect, useState } from "react";

export const Web3AuthContext = createContext({
  accountId: "",
  isWalletConnected: false,
  ready: false,
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

  useEffect(() => {
    (async () => {
      const _isConnected = await wallet.isSignedIn();
      setIsConnected(_isConnected);
      isReady(true);
    })();
  }, []);

  return (
    <Web3AuthContext.Provider
      value={{ isWalletConnected, ready, accountId: wallet.accountId || "" }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export default Web3AuthProvider;
