import { create } from "zustand";
import { persist } from "zustand/middleware";

import { NEARSocialUserProfile } from "@nadabot/common/services/contracts/social";

import { updateState } from "./utils";

interface State {
  accountId: string;
  walletConnected: boolean;
  isAdmin: boolean;
  profileInfo?: NEARSocialUserProfile;
  isVerifiedHuman: boolean;
  score: number;
}

type UpdateInfo = Partial<State>;

interface Actions {
  updateInfo: (info: UpdateInfo) => void;
  reset: () => void;
}

const initialState: State = {
  accountId: "",
  walletConnected: false,
  isAdmin: false,
  profileInfo: undefined,
  isVerifiedHuman: false,
  score: 0,
};

export const useUser = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      // update info
      updateInfo: (info: UpdateInfo) =>
        set(() => {
          return updateState(info);
        }),

      // reset
      reset: () => set(initialState),
    }),
    { name: "userStore" },
  ),
);
