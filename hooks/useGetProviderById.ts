import { useEffect, useState } from "react";
import { useProviders } from "./store/useProviders";
import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";

const useGetProviderById = (providerId?: string) => {
  const { providers } = useProviders();
  const [provider, setProvider] = useState<ProviderExternal>();

  useEffect(() => {
    if (providerId) {
      setProvider(
        providers.find((provider) => provider.provider_id === providerId)
      );
    }
  }, [providerId, providers]);

  return provider;
};

export default useGetProviderById;
