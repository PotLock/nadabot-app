import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as contract from "@nadabot/services/web3/contract-interface";
import { StampExternal } from "@nadabot/services/web3/interfaces/stamps";

type State = {
  stamps: StampExternal[];
  ready: boolean;
};

interface Actions {
  fetchStamps: (account_id: string) => Promise<void>;
  reset: () => void;
}

const initialState: State = {
  stamps: [],
  ready: true,
};

export const useStamps = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // fetch stamps
      fetchStamps: async (account_id: string) => {
        set({ ready: false, stamps: get().stamps });
        const response = await contract.get_stamps_for_account_id({
          account_id,
        });

        // sort stamps to show the newest first
        const sortedStamps = response.sort(
          (stampA, stampB) => stampA.validated_at_ms - stampB.validated_at_ms,
        );

        set({ ready: true, stamps: sortedStamps });
      },

      // reset
      reset: () => set(initialState),
    }),
    { name: "stampsStore" },
  ),
);
