import {
  ProviderExternal,
  ProviderExternalWithIsHuman,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

/**
 * sort providers to show the most weight first
 * @param providers
 * @returns
 */
const higherWeightFirst = (
  providers: ProviderExternal[] | ProviderExternalWithIsHuman[],
) =>
  providers.sort(
    (providerA, providerB) =>
      providerB.default_weight - providerA.default_weight,
  ) as typeof providers;

const providerSorts = {
  higherWeightFirst,
};

export default providerSorts;
