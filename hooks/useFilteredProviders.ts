import { useCallback, useEffect, useState } from "react";

import { DEFAULT_ACCOUNT_ID_ARG_NAME } from "@nadabot/common/constants";
import {
  ProviderExternalWithIsHuman,
  ProviderId,
  ProviderStatus,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import { isHumanCheck } from "@nadabot/common/services/web3/isHumanCheck";

import { useProviders } from "./store/useProviders";
import { useStamps } from "./store/useStamps";
import { useUser } from "./store/useUser";
import useIsAdminPage from "./useIsAdminPage";

type Props = {
  skipProviderId?: ProviderId;
  sortMethod?: (
    providers: ProviderExternalWithIsHuman[],
  ) => ProviderExternalWithIsHuman[];
};

/**
 * Provide filtered providers adding if the user is a human inside this provider or not
 * [it also removes providers in with the user has completed the requirement / is verified]
 * @param props.skipProviderId Skip provider with this id
 * @param props.sortMethod Sort list method
 * @returns
 */
const useFilteredProviders = ({ skipProviderId, sortMethod }: Props) => {
  const { accountId } = useUser();
  const [active, setActive] = useState<ProviderExternalWithIsHuman[]>([]);
  const [deactivated, setDeactivated] = useState<ProviderExternalWithIsHuman[]>(
    [],
  );
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

  const isAdminPage = useIsAdminPage();

  // Fetch human info and update providers list with this information
  const fetchIsHumanInfo = useCallback(async () => {
    if (providersReady) {
      const tempHuman: ProviderExternalWithIsHuman[] = [];

      // is human check
      const promises = providers.map(async (provider) => {
        // Is Human Check
        if (accountId) {
          try {
            const isHuman = await isHumanCheck(
              provider.contract_id,
              provider.method_name,
              provider.account_id_arg_name ?? DEFAULT_ACCOUNT_ID_ARG_NAME,
              accountId,
            );

            tempHuman.push({ ...provider, is_user_a_human: isHuman });
          } catch (error) {
            const titleErrorStyle =
              "font-weight: 600; background-color: #000000; color: #FFFFFF; padding: 4px 2px; margin-top: 2px;";
            const contentErrorStyle = "font-weight: normal;";
            console.error(
              `Error checking if user is human. \n%cProvider Name:%c ${provider.provider_name} \n%cContractID:%c ${provider.contract_id} \n%cMethod Name:%c ${provider.method_name}. \n%cError Body:%c ${error}`,
              titleErrorStyle,
              contentErrorStyle,
              titleErrorStyle,
              contentErrorStyle,
              titleErrorStyle,
              contentErrorStyle,
              titleErrorStyle,
              contentErrorStyle,
            );
            tempHuman.push({ ...provider, is_user_a_human: false });
          }
        } else {
          tempHuman.push({ ...provider, is_user_a_human: false });
        }
      });

      await Promise.allSettled(promises);

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
      const tempDeactivated: ProviderExternalWithIsHuman[] = [];
      const tempActiveIsHuman: ProviderExternalWithIsHuman[] = [];
      const tempActiveNoHuman: ProviderExternalWithIsHuman[] = [];

      updatedProviders.forEach((provider) => {
        // Check if current user has a stamp for this provider, if so, skip it
        let hasStamp = false;
        stamps.forEach((stamp) => {
          if (!hasStamp && stamp.provider.id === provider.id) {
            hasStamp = true;
          }
        });

        // NOTE: If it's /admin page, should show all providers
        if (provider.id !== skipProviderId && (!hasStamp || isAdminPage)) {
          // Active
          if (provider.status === ProviderStatus.Active) {
            tempActive.push(provider);

            // Provider in with this user is human
            if (provider.is_user_a_human) {
              tempActiveIsHuman.push(provider);
            } else {
              // Provider in with this user is not a human
              tempActiveNoHuman.push(provider);
            }
          } else {
            tempDeactivated.push(provider);
          }
        }
      });

      setActive(
        sortMethod
          ? (sortMethod(tempActive) as ProviderExternalWithIsHuman[])
          : tempActive,
      );

      setDeactivated(
        sortMethod
          ? (sortMethod(tempDeactivated) as ProviderExternalWithIsHuman[])
          : tempDeactivated,
      );

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
  }, [
    updatedProviders,
    skipProviderId,
    stamps,
    accountId,
    ready,
    sortMethod,
    isAdminPage,
  ]);

  return {
    all: sortMethod ? sortMethod(updatedProviders) : updatedProviders,
    active,
    deactivated,
    activeIsHuman,
    activeNoHuman,
    ready,
  };
};

export default useFilteredProviders;
