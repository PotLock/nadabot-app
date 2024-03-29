import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as contract from "@nadabot/services/contracts/sybil.nadabot";
import {
  ProviderExternal,
  UpdateProviderInput,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

type State = {
  providers: ProviderExternal[];
  ready: boolean;
};

interface Actions {
  fetchProviders: (changeReadyState?: boolean) => Promise<void>;
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
      fetchProviders: async (changeReadyState = true) => {
        set({
          ready: changeReadyState ? false : get().ready,
          providers: get().providers,
        });
        const response = await contract.get_providers();

        set({
          ready: changeReadyState ? true : get().ready,
          providers: response,
        });
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
