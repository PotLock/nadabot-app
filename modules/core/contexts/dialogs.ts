import { createContext, useContext } from "react";

import { GroupId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

export enum DIALOGS {
  None,
  NoConnected,
  StampSent,
  Error,
  ViewProvider,
  ConfirmVerification,
  GroupDialog,
}

export type DialogProps = {
  title?: string;
  description?: string;
  providerId?: ProviderId;
  groupId?: GroupId;
};

export type DialogParameters = {
  dialog: DIALOGS;
  props?: DialogProps;
  onClickOk?: VoidFunction;
  onClickCancel?: VoidFunction;
};

export const DialogsContext = createContext<{
  currentDialog: DIALOGS;
  openDialog: (params: DialogParameters) => void;
}>({
  currentDialog: DIALOGS.None,

  openDialog: () => {
    throw new Error("openDialog must be defined");
  },
});

export const useDialogs = () => useContext(DialogsContext);
