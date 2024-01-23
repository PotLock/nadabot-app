import { useEffect, useState } from "react";

import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";

import { useProviders } from "./store/useProviders";

/**
 * Provide filtered providers
 * @param skipProviderId Skip provider with this id
 * @returns
 */
const useFilteredProviders = (skipProviderId: string = "") => {
  const [active, setActive] = useState<ProviderExternal[]>([]);
  const [deactivated, setDeactivated] = useState<ProviderExternal[]>([]);
  const [flagged, setFlagged] = useState<ProviderExternal[]>([]);
  const [unflagged, setUnflagged] = useState<ProviderExternal[]>([]);
  const { providers } = useProviders();

  useEffect(() => {
    const tempActive: ProviderExternal[] = [];
    const tempDeactivated: ProviderExternal[] = [];
    const tempFlagged: ProviderExternal[] = [];
    const tempUnflagged: ProviderExternal[] = [];

    providers.forEach((provider) => {
      if (provider.provider_id !== skipProviderId) {
        if (provider.is_active) {
          tempActive.push(provider);
        } else {
          tempDeactivated.push(provider);
        }

        if (provider.is_flagged) {
          tempFlagged.push(provider);
        } else {
          tempUnflagged.push(provider);
        }
      }
    });

    setActive(tempActive);
    setDeactivated(tempDeactivated);
    setFlagged(tempFlagged);
    setUnflagged(tempUnflagged);
  }, [providers, skipProviderId]);

  return {
    all: providers,
    active,
    deactivated,
    flagged,
    unflagged,
  };
};

export default useFilteredProviders;
