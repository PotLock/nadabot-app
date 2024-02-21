import { Transaction, buildTransaction } from "@wpdas/naxios";

import { FULL_TGAS, TWO_HUNDREDTHS_NEAR } from "@nadabot/constants";

import { contractApi } from "../contracts/sybil.nadabot";
import { ProviderExternalWithIsHuman } from "../contracts/sybil.nadabot/interfaces/providers";

/**
 * Add many stamps at once
 * @param providers
 */
const addMultipleStamps = (providers: ProviderExternalWithIsHuman[]) => {
  const listOfTransactions: Transaction<{ provider_id: string }>[] = [];

  // Limits it to process 8 items per time
  for (const provider of providers.slice(0, 8)) {
    listOfTransactions.push(
      buildTransaction("add_stamp", {
        args: {
          provider_id: provider.provider_id,
        },
        gas: FULL_TGAS,
        deposit: TWO_HUNDREDTHS_NEAR,
      }),
    );
  }

  contractApi.callMultiple(listOfTransactions);
};

export default addMultipleStamps;
