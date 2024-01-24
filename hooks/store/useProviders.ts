import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as contract from "@nadabot/services/web3/contract-interface";
import {
  ProviderExternal,
  UpdateProviderInput,
} from "@nadabot/services/web3/interfaces/providers";

type State = {
  providers: ProviderExternal[];
  ready: boolean;
};

interface Actions {
  fetchProviders: () => Promise<void>;
  updateProvider: (newProviderInfo: UpdateProviderInput) => void;
  reset: () => void;
}

const initialState: State = {
  providers: [],
  ready: true,
};

export const useProviders = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // fetch providers
      fetchProviders: async () => {
        set({ ready: false, providers: get().providers });
        const response = await contract.get_providers();

        // sort providers to show the newest first
        const sortedProviders = response.sort(
          (providerA, providerB) =>
            providerB.submitted_at_ms - providerA.submitted_at_ms,
        );

        set({ ready: true, providers: sortedProviders });
      },

      // update provider
      updateProvider: (newProviderInfo: UpdateProviderInput) => {
        const updatedProviders = get().providers.map((provider) => {
          if (provider.provider_id === newProviderInfo.provider_id) {
            provider = { ...provider, ...newProviderInfo };
          }
          return provider;
        });

        set({ providers: updatedProviders });
      },

      // reset
      reset: () => set(initialState),
    }),
    { name: "providersStore" },
  ),
);
