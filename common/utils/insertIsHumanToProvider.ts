import {
  ProviderExternal,
  ProviderExternalWithIsHuman,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

/**
 * Inserts { is_user_a_human: boolean } to regular provider (ProviderExternal)
 * @param provider
 * @returns {ProviderExternalWithIsHuman} provider with { is_user_a_human: boolean }
 */
const insertIsHumanToProvider = (provider: ProviderExternal) =>
  ({ ...provider, is_user_a_human: false }) as ProviderExternalWithIsHuman;

export default insertIsHumanToProvider;
