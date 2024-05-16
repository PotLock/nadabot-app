import { MemoryCache } from "@wpdas/naxios";

import { naxiosInstance } from "../contracts";

export const isHumanCheck = async (
  contractId: string,
  method: string,
  accountIdArgName: string,
  accountId: string,
) => {
  // New contract instance
  const providerContract = await naxiosInstance.contractApi({
    contractId: contractId,
    cache: new MemoryCache({ expirationTime: 10 }),
  });

  // View call to check if account_id (aka accountIdArgName) is human
  const isHuman = await providerContract.view<{}, boolean>(
    method,
    {
      args: { [accountIdArgName]: accountId },
    },
    { useCache: true },
  );

  return isHuman;
};
