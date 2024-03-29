import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupNearFi } from "@near-wallet-selector/nearfi";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupXDEFI } from "@near-wallet-selector/xdefi";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";
import naxios from "@wpdas/naxios";

import { CONTRACT_ID, NETWORK } from "@nadabot/constants";

// Naxios (Contract/Wallet) Instance
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
