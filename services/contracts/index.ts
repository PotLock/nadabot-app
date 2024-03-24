import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import naxios from "@wpdas/naxios";

import { CONTRACT_ID, NETWORK } from "@nadabot/constants";

// Naxios (Contract/Wallet) Instance
export const naxiosInstance = new naxios({
  contractId: CONTRACT_ID,
  network: NETWORK,
  walletSelectorModules: [
    setupMyNearWallet(),
    setupLedger(),
    setupHereWallet(),
    setupMeteorWallet(),
    setupNearMobileWallet(),
  ],
});

/**
 * NEAR Wallet API
 */
export const walletApi = naxiosInstance.walletApi();
