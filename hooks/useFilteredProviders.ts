import { useEffect, useState } from "react";

import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";

import { useProviders } from "./store/useProviders";
import { useStamps } from "./store/useStamps";

/**
 * Provide filtered providers [it also removes providers in with the user has completed the requiriment / is vefiried]
 * @param skipProviderId Skip provider with this id
 * @returns
 */
const useFilteredProviders = (skipProviderId: string = "") => {
  const [active, setActive] = useState<ProviderExternal[]>([]);
  const [deactivated, setDeactivated] = useState<ProviderExternal[]>([]);
  const [flagged, setFlagged] = useState<ProviderExternal[]>([]);
  const [unflagged, setUnflagged] = useState<ProviderExternal[]>([]);
  const { providers, ready } = useProviders();
  const { stamps } = useStamps();

  useEffect(() => {
    const tempActive: ProviderExternal[] = [];
    const tempDeactivated: ProviderExternal[] = [];
    const tempFlagged: ProviderExternal[] = [];
    const tempUnflagged: ProviderExternal[] = [];

    providers.forEach((provider) => {
      // Check if current user has a stamp for this provider, if so, skip it
      let hasStamp = false;
      stamps.forEach((stamp) => {
        if (!hasStamp && stamp.provider.provider_id === provider.provider_id) {
          hasStamp = true;
        }
      });

      if (provider.provider_id !== skipProviderId && !hasStamp) {
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
  }, [providers, skipProviderId, stamps]);

  return {
    all: providers,
    active,
    deactivated,
    flagged,
    unflagged,
    ready,
  };
};

export default useFilteredProviders;
