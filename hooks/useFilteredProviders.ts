import { useEffect, useState } from "react";

import {
  ProviderExternal,
  ProviderExternalWithIsHuman,
  ProviderStatus,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

import { useProviders } from "./store/useProviders";
import { useStamps } from "./store/useStamps";

type Props = {
  skipProviderId?: string;
  sortMethod?: (
    providers: ProviderExternal[] | ProviderExternalWithIsHuman[],
  ) => ProviderExternal[] | ProviderExternalWithIsHuman[];
};

/**
 * Provide filtered providers [it also removes providers in with the user has completed the requiriment / is vefiried]
 * @param skipProviderId Skip provider with this id
 * @param props.sortMethod Sort list method
 * @returns
 */
const useFilteredProviders = ({ skipProviderId, sortMethod }: Props) => {
  const [active, setActive] = useState<ProviderExternal[]>([]);
  const [deactivated, setDeactivated] = useState<ProviderExternal[]>([]);
  const { providers, ready } = useProviders();
  const { stamps } = useStamps();

  useEffect(() => {
    const tempActive: ProviderExternal[] = [];
    const tempDeactivated: ProviderExternal[] = [];

    providers.forEach((provider) => {
      // Check if current user has a stamp for this provider, if so, skip it
      let hasStamp = false;
      stamps.forEach((stamp) => {
        if (!hasStamp && stamp.provider.provider_id === provider.provider_id) {
          hasStamp = true;
        }
      });

      if (provider.provider_id !== skipProviderId && !hasStamp) {
        if (provider.status === ProviderStatus.Active) {
          tempActive.push(provider);
        } else {
          tempDeactivated.push(provider);
        }
      }
    });

    setActive(sortMethod ? sortMethod(tempActive) : tempActive);
    setDeactivated(sortMethod ? sortMethod(tempDeactivated) : tempDeactivated);
  }, [providers, skipProviderId, stamps, sortMethod]);

  return {
    all: sortMethod ? sortMethod(providers) : providers,
    active,
    deactivated,
    ready,
  };
};

export default useFilteredProviders;
