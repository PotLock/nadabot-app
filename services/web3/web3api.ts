import "@near-wallet-selector/modal-ui/styles.css";
import naxios from "@wpdas/naxios";

import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

import { CONTRACT_ID } from "./constants";

const naxiosInstance = new naxios({
  contractId: CONTRACT_ID,
  network: "testnet",
  walletSelectorModules: [
    setupMyNearWallet(),
    setupNearWallet(),
    setupLedger(),
    setupHereWallet(),
    setupMeteorWallet(),
    setupNearMobileWallet(),
  ],
});

/**
 * NEAR Contract API
 */
export const contractApi = naxiosInstance.contractApi();

/**
 * NEAR Wallet API
 */
export const walletApi = naxiosInstance.walletApi();
