import { useEffect, useState } from "react";

import { ProviderExternalWithIsHuman } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

import useFilteredProviders from "./useFilteredProviders";

const useGetProviderById = (providerId?: string) => {
  const { all } = useFilteredProviders({});
  const [provider, setProvider] = useState<ProviderExternalWithIsHuman>();

  useEffect(() => {
    if (providerId) {
      setProvider(all.find((provider) => provider.provider_id === providerId));
    }
  }, [providerId, all]);

  return provider;
};

export default useGetProviderById;
