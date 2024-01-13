import { contractApi } from "./web3api";
import { Config } from "./interfaces/lib";
import {
  ProviderExternal,
  RegisterProviderInput,
} from "./interfaces/providers";

// READ METHODS

/**
 * Get config
 */
export const get_config = () => contractApi.view<{}, Config>("get_config");

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
