import { useCallback, useEffect, useState } from "react";

import {
  ProviderExternal,
  ProviderExternalWithIsHuman,
  ProviderStatus,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import { isHumanCheck } from "@nadabot/services/web3/isHumanCheck";

import { useProviders } from "./store/useProviders";
import { useStamps } from "./store/useStamps";
import { useUser } from "./store/useUser";

type Props = {
  skipProviderId?: string;
  sortMethod?: (
    providers: ProviderExternal[] | ProviderExternalWithIsHuman[],
  ) => ProviderExternal[] | ProviderExternalWithIsHuman[];
};

/**
 * Provide filtered providers adding if the user is a human inside this provider or not
 * [it also removes providers in with the user has completed the requiriment / is vefiried]
 * @param props.skipProviderId Skip provider with this id
 * @param props.sortMethod Sort list method
 * @returns
 */
const useIsHumanFilteredProviders = ({ skipProviderId, sortMethod }: Props) => {
  const { accountId } = useUser();
  const [active, setActive] = useState<ProviderExternalWithIsHuman[]>([]);
  const [activeIsHuman, setActiveIsHuman] = useState<
    ProviderExternalWithIsHuman[]
  >([]);
  const [activeNoHuman, setActiveNoHuman] = useState<
    ProviderExternalWithIsHuman[]
  >([]);
  const [updatedProviders, setUpdatedProviders] = useState<
    ProviderExternalWithIsHuman[]
  >([]);
  const { providers, ready: providersReady } = useProviders();
  const [ready, isReady] = useState(false);
  const { stamps } = useStamps();

  const fetchIsHumanInfo = useCallback(async () => {
    if (providersReady) {
      const tempActive: ProviderExternalWithIsHuman[] = [];
      const tempHuman: ProviderExternalWithIsHuman[] = [];

      // is human check
      const promises = providers.map(async (provider) => {
        // Active (not logged in)
        if (!accountId) {
          if (provider.status === ProviderStatus.Active) {
            tempActive.push({ ...provider, is_user_a_human: false });
          }
        }

        // Is Human Check
        if (accountId) {
          const isHuman = await isHumanCheck(
            provider.contract_id,
            provider.method_name,
            provider.account_id_arg_name,
            accountId,
          );

          tempHuman.push({ ...provider, is_user_a_human: isHuman });
        }
      });

      await Promise.allSettled(promises);

      // (not logged in state)
      if (!accountId) {
        setActive(
          sortMethod
            ? (sortMethod(tempActive) as ProviderExternalWithIsHuman[])
            : tempActive,
        );
      }

      setUpdatedProviders(
        sortMethod
          ? (sortMethod(tempHuman) as ProviderExternalWithIsHuman[])
          : tempHuman,
      );
      isReady(true);
    }
  }, [accountId, providers, providersReady, sortMethod]);

  useEffect(() => {
    fetchIsHumanInfo();
  }, [fetchIsHumanInfo]);

  useEffect(() => {
    if (ready) {
      const tempActive: ProviderExternalWithIsHuman[] = [];
      const tempActiveIsHuman: ProviderExternalWithIsHuman[] = [];
      const tempActiveNoHuman: ProviderExternalWithIsHuman[] = [];

      updatedProviders.forEach((provider) => {
        // Check if current user has a stamp for this provider, if so, skip it
        let hasStamp = false;
        stamps.forEach((stamp) => {
          if (
            !hasStamp &&
            stamp.provider.provider_id === provider.provider_id
          ) {
            hasStamp = true;
          }
        });

        if (provider.provider_id !== skipProviderId && !hasStamp) {
          // Active
          if (provider.status === ProviderStatus.Active) {
            tempActive.push({ ...provider, is_user_a_human: false });

            // Provider in with this user is human
            if (provider.is_user_a_human) {
              tempActiveIsHuman.push(provider);
            } else {
              // Provider in with this user is not a human
              tempActiveNoHuman.push(provider);
            }
          }
        }
      });

      if (accountId) {
        setActive(
          sortMethod
            ? (sortMethod(tempActive) as ProviderExternalWithIsHuman[])
            : tempActive,
        );
      }

      setActiveIsHuman(
        sortMethod
          ? (sortMethod(tempActiveIsHuman) as ProviderExternalWithIsHuman[])
          : tempActiveIsHuman,
      );

      setActiveNoHuman(
        sortMethod
          ? (sortMethod(tempActiveNoHuman) as ProviderExternalWithIsHuman[])
          : tempActiveNoHuman,
      );
    }
  }, [updatedProviders, skipProviderId, stamps, accountId, ready, sortMethod]);

  return {
    all: sortMethod ? sortMethod(providers) : providers,
    active,
    activeIsHuman,
    activeNoHuman,
    ready,
  };
};

export default useIsHumanFilteredProviders;
