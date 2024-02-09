import { useEffect, useState } from "react";

import { ProviderExternal } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

import { useProviders } from "./store/useProviders";

const useGetProviderById = (providerId?: string) => {
  const { providers } = useProviders();
  const [provider, setProvider] = useState<ProviderExternal>();

  useEffect(() => {
    if (providerId) {
      setProvider(
        providers.find((provider) => provider.provider_id === providerId),
      );
    }
  }, [providerId, providers]);

  return provider;
};

export default useGetProviderById;
