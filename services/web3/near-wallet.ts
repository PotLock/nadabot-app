// near api js
import { keyStores, providers } from "near-api-js";

// wallet selector UI
import "@near-wallet-selector/modal-ui/styles.css";
import { setupModal } from "@near-wallet-selector/modal-ui";
import NearIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import LedgerIconUrl from "@near-wallet-selector/ledger/assets/ledger-icon.png";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";

// wallet selector options
import {
  setupWalletSelector,
  WalletSelector,
  Wallet as CoreWallet,
} from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { QueryResponseKind } from "near-api-js/lib/providers/provider";

const THIRTY_TGAS = "30000000000000";
const NO_DEPOSIT = "0";

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "testnet";
const LOCAL_STORAGE_KEY_PREFIX = "places:keystore:";

type ResultType = QueryResponseKind & { result: any };

// Wallet that simplifies using the wallet selector
export class Wallet {
  walletSelector!: WalletSelector;
  wallet!: CoreWallet | null;
  accountId!: string | null;
  contractId: string | null;

  constructor({ contractId }: { contractId: string }) {
    this.contractId = contractId;
  }

  // To be called when the website loads
  async startUp(openSignInModal = false) {
    this.walletSelector = await setupWalletSelector({
      network: NETWORK === "mainnet" ? "mainnet" : "testnet",
      modules: [
        setupNearWallet({ iconUrl: NearIconUrl.src }),
        setupMyNearWallet({ iconUrl: MyNearIconUrl.src }),
        setupLedger({ iconUrl: LedgerIconUrl.src }),
      ],
    });

    const isSignedIn = this.walletSelector.isSignedIn();

    if (isSignedIn) {
      const { accounts } = this.walletSelector.store.getState();
      this.wallet = await this.walletSelector.wallet();
      this.accountId = accounts[0].accountId;
    } else if (openSignInModal) {
      this.signIn();
    }

    return isSignedIn;
  }

  async isSignedIn() {
    return this.startUp();
  }

  // Sign-in method
  signIn() {
    const description = "Please select a wallet to sign in.";
    const modal = setupModal(this.walletSelector, {
      contractId: this.contractId!,
      description,
    });
    modal.show();
  }

  // Sign-out method
  signOut() {
    this.wallet!.signOut();
    this.wallet = this.accountId = this.contractId = null;
    window.location.replace(window.location.origin + window.location.pathname);
  }

  getPublicKey() {
    if (!this.walletSelector) return;
    const walletState = this.walletSelector.store.getState();
    if (walletState.accounts.length === 0) return;

    return walletState.accounts[0].publicKey;
  }

  async signMessage(msg: string) {
    if (!this.accountId) return;

    // Create an In-Memory keypair
    const keyStore = new keyStores.BrowserLocalStorageKeyStore(
      localStorage,
      LOCAL_STORAGE_KEY_PREFIX
    );
    const keyPair = await keyStore.getKey(NETWORK, this.accountId as string);
    if (!keyPair) return;

    // Sign the message using the keypair
    // const msgBuf = Buffer.from(JSON.stringify(msg))
    const msgBuf = Buffer.from(msg);
    const signedMessage = keyPair.sign(msgBuf);
    return signedMessage;
  }

  // Make a read-only call to retrieve information from the network
  async viewMethod({ contractId = this.contractId!, method = "", args = {} }) {
    if (!this.walletSelector) {
      await this.startUp();
    }

    const { network } = this.walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = (await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "optimistic",
    })) as ResultType;
    // console.log('near-wallet -> viewMethod ->', res)
    return JSON.parse(Buffer.from(res.result).toString());
  }

  // Call a method that changes the contract's state
  async callMethod({
    contractId = this.contractId,
    method = "",
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  }) {
    const { accountId } = this.walletSelector.store.getState().accounts[0];

    // Sign a transaction with the "FunctionCall" action
    const outcome = await this.wallet!.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId!,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });

    return providers.getTransactionLastResult(
      outcome as providers.FinalExecutionOutcome
    );
  }
}

// Wallet instance to be used over the app
const contractId = process.env.NEXT_PUBLIC_CONTRACT_NAME as string;
export const wallet = new Wallet({ contractId });
