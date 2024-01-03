/**
 * Interfaces are following "https://github.com/PotLock/core/blob/main/contracts/sybil/src" folder structure
 */

import { Config } from "./interfaces/lib";
import {
  ProviderExternal,
  RegisterProviderInput,
} from "./interfaces/providers";
import { Wallet } from "./near-wallet";

/**
 * PotLock Sybil Contract
 * https://github.com/PotLock/core/tree/main/contracts/sybil
 */
export class PotLockSybilContractInterface {
  public wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  // Read Methods

  /**
   * Get config
   */
  async getConfig() {
    return (await this.wallet.viewMethod({
      method: "get_config",
    })) as Promise<Config>;
  }

  // Write Methods

  /**
   * Anyone can call this method to register a provider. If caller is admin, provider is automatically activated.
   */
  async registerProvider(place: RegisterProviderInput) {
    return (await this.wallet.callMethod({
      method: "register_provider",
      args: { place },
    })) as Promise<ProviderExternal>;
  }
}
