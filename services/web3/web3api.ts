import "@near-wallet-selector/modal-ui/styles.css";
import naxios from "@wpdas/naxios/dist";

import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupNearMobileWallet } from "@near-wallet-selector/near-mobile-wallet";
import NearIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";
import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
import HereIconUrl from "@near-wallet-selector/here-wallet/assets/here-wallet-icon.png";

import { CONTRACT_ID } from "./constants";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import MeteorIconUrl from "@near-wallet-selector/meteor-wallet/assets/meteor-icon.png";

const naxiosInstance = new naxios({
  contractId: CONTRACT_ID,
  network: "testnet",
  walletSelectorModules: [
    setupMyNearWallet({ iconUrl: MyNearIconUrl.src }),
    setupNearWallet({ iconUrl: NearIconUrl.src }),
    setupLedger({ iconUrl: LedgerIconUrl.src }),
    setupHereWallet({ iconUrl: HereIconUrl.src }),
    setupMeteorWallet({ iconUrl: MeteorIconUrl.src }),
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
