import { Provider } from "near-api-js/lib/providers";

import { FULL_TGAS, HALF_YOCTO_NEAR } from "./constants";
import { Config } from "./interfaces/lib";
import {
  ActivateProviderInput,
  DeactivateProviderInput,
  FlagProviderInput,
  ProviderExternal,
  RegisterProviderInput,
  UnflagProviderInput,
  UpdateProviderInput,
} from "./interfaces/providers";
import {
  AccountId,
  GetStampsForAccountIdInput,
  GetUsersForStampInput,
  StampExternal,
} from "./interfaces/stamps";
import { contractApi } from "./web3api";

// READ METHODS

/**
 * Get Config
 */
export const get_config = () => contractApi.view<{}, Config>("get_config");

/**
 * Get Providers
 * @returns
 */
export const get_providers = () =>
  contractApi.view<object, ProviderExternal[]>("get_providers");

/**
 * Get Stamps for Account Id
 * @returns
 */
export const get_stamps_for_account_id = (args: GetStampsForAccountIdInput) =>
  contractApi.view<typeof args, StampExternal[]>("get_stamps_for_account_id", {
    args,
  });

/**
 * Get Users for Stamps
 * @returns
 */
export const get_users_for_stamp = (args: GetUsersForStampInput) =>
  contractApi.view<typeof args, AccountId[]>("get_users_for_stamp", {
    args,
  });

// WRITE METHODS
/**
 * Anyone can call this method to register a provider. If caller is admin, provider is automatically activated.
 */
export const register_provider = (args: RegisterProviderInput) => {
  return new Promise((resolve, reject) => {
    // First try without attaching yoctoNEAR
    contractApi
      .call<typeof args, ProviderExternal>("register_provider", {
        args,
      })
      .then((result1) => resolve(result1))
      .catch((error1) => {
        // Second try attaching yoctoNEAR
        const errorObj = JSON.parse(error1.message);
        const errorMsg = errorObj.kind.ExecutionError as string;

        // attach yoctoNEAR Error
        if (errorMsg.includes("yoctoNEAR to cover storage")) {
          const gasErrorMsg = errorMsg.split(": ")[1];
          const yoctoNEARNeeded = gasErrorMsg.replace(/\D/g, "");

          contractApi
            .call<typeof args, ProviderExternal>("register_provider", {
              args,
              deposit: yoctoNEARNeeded,
            })
            .then((result2) => resolve(result2))
            .catch((error2) => reject(error2));
        } else {
          reject(error1);
        }
      });
  });
};

/**
 * Set default human threshold
 * @param default_human_threshold
 * @returns
 */
export const admin_set_default_human_threshold = (
  default_human_threshold: number,
) =>
  contractApi.call("admin_set_default_human_threshold", {
    args: {
      default_human_threshold,
    },
    deposit: HALF_YOCTO_NEAR,
  });

/**
 * Set Stamp
 *
 * Undefined response indicates that user is not verified on target provider
 * @param provider_id
 * @returns
 */
export const set_stamp = (provider_id: string) =>
  contractApi.call<object, StampExternal | undefined>("set_stamp", {
    args: {
      provider_id,
    },
  });

/**
 * Add Stamp
 *
 * Undefined response indicates that user is not verified on target provider
 * @param provider_id
 * @returns
 */
export const add_stamp = (provider_id: string) =>
  contractApi.call<object, StampExternal | undefined>("add_stamp", {
    args: {
      provider_id,
    },
    gas: FULL_TGAS,
    deposit: HALF_YOCTO_NEAR,
    callbackUrl: `${window.location.href}?verifiedProvider=${provider_id}`,
  });

/**
 * Update Provider - This method can only be called by the provider's original submitter, or sybil contract owner/admin.
 * @param args
 * @returns
 */
export const update_provider = (args: UpdateProviderInput) =>
  contractApi.call<typeof args, ProviderExternal>("update_provider", {
    args,
  });

/**
 * Activate Provider
 * @param args
 * @returns
 */
export const admin_activate_provider = (args: ActivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_activate_provider", {
    args,
  });

/**
 * Deactivate Provider
 * @param args
 * @returns
 */
export const admin_deactivate_provider = (args: DeactivateProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_deactivate_provider", {
    args,
  });

/**
 * Flag Provider
 * @param args
 * @returns
 */
export const admin_flag_provider = (args: FlagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_flag_provider", {
    args,
  });

/**
 * Unflag Provider
 * @param args
 * @returns
 */
export const admin_unflag_provider = (args: UnflagProviderInput) =>
  contractApi.call<typeof args, Provider>("admin_unflag_provider", {
    args,
  });
