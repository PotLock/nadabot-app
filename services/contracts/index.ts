import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupEthereumWallets } from "@near-wallet-selector/ethereum-wallets";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";
// import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import { setupNearFi } from "@near-wallet-selector/nearfi";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupSender } from "@near-wallet-selector/sender";
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";
import { setupXDEFI } from "@near-wallet-selector/xdefi";
import { injected, walletConnect } from "@wagmi/connectors";
import {
  // Config as WagmiConfig,
  createConfig,
  http,
  reconnect,
} from "@wagmi/core";
import { createWeb3Modal } from "@web3modal/wagmi";
import naxios from "@wpdas/naxios";
import { Chain } from "viem";

// type MergedWagmiConfig = WagmiConfig & NearWagmiConfig;
import { CONTRACT_ID, NETWORK } from "@nadabot/constants";

const REOWN_PROJECT_ID = "1adabeaaefb2b771ff4ebdf902b128b7";

export const nearChain: Chain = {
  id: 397,
  name: "NEAR",
  nativeCurrency: {
    name: "NEAR",
    symbol: "NEAR",
    decimals: 24,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.near.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "NEAR Explorer",
      url: "https://nearblocks.io",
    },
  },
};

const wagmiConfig = createConfig({
  chains: [nearChain],
  transports: {
    [nearChain.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: REOWN_PROJECT_ID,
      showQrModal: false,
    }),
    injected({ shimDisconnect: true }),
  ],
});
reconnect(wagmiConfig);

const web3Modal = createWeb3Modal({
  wagmiConfig,
  projectId: REOWN_PROJECT_ID,
});

export const naxiosInstance = new naxios({
  contractId: CONTRACT_ID,
  network: NETWORK,
  walletSelectorModules: [
    setupBitgetWallet(),
    setupSender(),
    setupHereWallet(),
    setupMathWallet(),
    setupMeteorWallet(),
    setupWelldoneWallet(),
    setupLedger(),
    setupNearFi(),
    setupCoin98Wallet(),
    setupNeth(),
    setupXDEFI(),
    setupNearMobileWallet(),
    setupEthereumWallets({ wagmiConfig, web3Modal }),
    setupMintbaseWallet({
      walletUrl: "https://wallet.mintbase.xyz",
      callbackUrl: "https://www.mywebsite.com",
      deprecated: false,
    }),
  ],
});

/**
 * NEAR Wallet API
 */
export const walletApi = naxiosInstance.walletApi();
