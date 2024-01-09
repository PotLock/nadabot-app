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
export const register_provider = (args: { place: RegisterProviderInput }) =>
  contractApi.call<typeof args, ProviderExternal>("register_provider", {
    args,
  });
