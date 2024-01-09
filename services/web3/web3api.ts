import "@near-wallet-selector/modal-ui/styles.css";
import naxios from "@wpdas/naxios/dist";
import { CONTRACT_ID } from "./constants";

const naxiosInstance = new naxios({
  contractId: CONTRACT_ID,
  network: "testnet",
});

/**
 * NEAR Contract API
 */
export const contractApi = naxiosInstance.contractApi();

/**
 * NEAR Wallet API
 */
export const walletApi = naxiosInstance.walletApi();
