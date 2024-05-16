import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupMintbaseWallet } from "@near-wallet-selector/mintbase-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import { setupNearFi } from "@near-wallet-selector/nearfi";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupSender } from "@near-wallet-selector/sender";
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";
import { setupXDEFI } from "@near-wallet-selector/xdefi";
import naxios from "@wpdas/naxios";

import { CONTRACT_ID, NETWORK } from "@nadabot/constants";

// Naxios (Contract/Wallet) Instance
export const naxiosInstance = new naxios({
  rpcNodeUrl: `https://${NETWORK.toLowerCase() === "mainnet" ? "near" : "near-testnet"}.lava.build`,
  contractId: CONTRACT_ID,
  network: NETWORK,
  walletSelectorModules: [
    setupBitgetWallet(),
    setupSender(),
    setupMyNearWallet(),
    setupHereWallet(),
    setupMathWallet(),
    setupMeteorWallet(),
    setupWelldoneWallet(),
    setupNightly(),
    setupLedger(),
    setupNearFi(),
    setupCoin98Wallet(),
    setupNeth(),
    setupXDEFI(),
    setupNearMobileWallet(),
    setupMintbaseWallet(),
  ],
});

/**
 * NEAR Wallet API
 */
export const walletApi = naxiosInstance.walletApi();
