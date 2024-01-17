import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Config } from "@nadabot/services/web3/interfaces/lib";
import * as contract from "@nadabot/services/web3/contract-interface";

type State = {
  config: Config;
  ready: boolean;
};

interface Actions {
  fetchConfig: () => Promise<void>;
  updateHumanThreshold: (humanThreshold: number) => void;
  reset: () => void;
}

const initialState: State = {
  config: {
    owner: "",
    admins: [],
    default_provider_ids: [],
    default_human_threshold: 0,
  },
  ready: true,
};

export const useConfig = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // fetch providers
      fetchConfig: async () => {
        set({ ready: false, config: get().config });
        const response = await contract.get_config();
        set({ ready: true, config: response });
      },

      // update human threshold locally
      updateHumanThreshold: (humanThreshold: number) =>
        set({
          config: { ...get().config, default_human_threshold: humanThreshold },
        }),

      // reset
      reset: () => set(initialState),
    }),
    { name: "configStore" }
  )
);
