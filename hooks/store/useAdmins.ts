import { walletApi } from "@nadabot/services/web3/web3api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  admins: string[];
  initialized: boolean;
}

type AdminsInfo = string[];

interface Actions {
  setAdmins: (admins: AdminsInfo) => void;
  reset: () => void;
}

const initialState: State = {
  admins: [],
  initialized: false,
};

export const useAdmins = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      // update info
      setAdmins: (admins: AdminsInfo) => {
        return set((state) => ({ admins, initialized: true }));
      },

      // reset
      reset: () => set(initialState),
    }),
    { name: "adminsStore" }
  )
);
