import { useEffect, useState } from "react";

import {
  ProviderExternal,
  ProviderExternalWithIsHuman,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

import useFilteredProviders from "./useFilteredProviders";

const useGetProviderById = (providerId?: ProviderExternal["id"]) => {
  const { all } = useFilteredProviders({});
  const [provider, setProvider] = useState<ProviderExternalWithIsHuman>();

  useEffect(() => {
    if (providerId) {
      setProvider(all.find((provider) => provider.id === providerId));
    }
  }, [providerId, all]);

  return provider;
};

export default useGetProviderById;
