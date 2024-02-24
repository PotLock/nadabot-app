import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  wasNotificationDisplayed: boolean;
  hasPendingVerification: boolean;
  loginTime?: number;
};

interface Actions {
  notificationWasDisplayed: () => void;
  setPendingVerification: (value: boolean) => void;
  registerLoginTime: () => void;
  reset: () => void;
}

const initialState: State = {
  wasNotificationDisplayed: false,
  hasPendingVerification: false,
};

export const useNotificationController = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      notificationWasDisplayed: () => set({ wasNotificationDisplayed: true }),

      setPendingVerification: (value: boolean) =>
        set({ hasPendingVerification: value }),

      registerLoginTime: () =>
        set({ loginTime: get().loginTime ? get().loginTime : Date.now() }),

      // reset
      reset: () => set(initialState),
    }),
    { name: "notificationControllerStore" },
  ),
);
