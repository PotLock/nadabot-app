import { FC, createContext, useCallback, useState } from "react";

import ConfirmVerificationDialog from "./ConfirmVerificationDialog";
import ErrorDialog from "./ErrorDialog";
import NoConnectedDialog from "./NoConnectedDialog";
import { GroupDialog } from "../groups/GroupDialog";
import StampSentDialog from "../stamps/StampSentDialog";
import ViewProviderDialog from "../stamps/ViewProviderDialog";
import { DIALOGS, DialogProps } from "../types";

type DialogParameters = {
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

type DialogsProviderProps = {
  children: JSX.Element;
};

const DialogsProvider: FC<DialogsProviderProps> = ({ children }) => {
  const [_openDialog, setOpenDialog] = useState({
    _onClickOk: () => {},
    _onClickCancel: () => {},
    dialog: DIALOGS.None,
  });

  // Dialog Props
  const [title, setTitle] = useState<DialogProps["title"]>();
  const [description, setDescription] = useState<DialogProps["description"]>();
  const [providerId, setProviderId] = useState<DialogProps["providerId"]>();
  const [groupId, setGroupId] = useState<DialogProps["groupId"]>();

  const openDialog = useCallback(
    ({ dialog, props, onClickOk, onClickCancel }: DialogParameters) => {
      setOpenDialog({
        _onClickOk: onClickOk ?? (() => {}),
        _onClickCancel: onClickCancel ?? (() => {}),
        dialog,
      });

      setTitle(props?.title ?? "");
      setDescription(props?.description ?? "");
      setProviderId(props?.providerId ?? 0);
      setGroupId(props?.groupId ?? 0);
    },

    [],
  );

  const closeDialog = useCallback(() => {
    setOpenDialog({
      _onClickOk: () => {},
      _onClickCancel: () => {},
      dialog: DIALOGS.None,
    });
  }, []);

  return (
    <DialogsContext.Provider
      value={{ openDialog, currentDialog: _openDialog.dialog }}
    >
      <NoConnectedDialog
        open={_openDialog.dialog === DIALOGS.NoConnected}
        onClose={closeDialog}
      />

      <StampSentDialog
        open={_openDialog.dialog === DIALOGS.StampSent}
        onClose={closeDialog}
      />

      <ErrorDialog
        open={_openDialog.dialog === DIALOGS.Error}
        onClose={closeDialog}
        props={{ title, description, providerId }}
      />

      <ConfirmVerificationDialog
        open={_openDialog.dialog === DIALOGS.ConfirmVerification}
        onClose={closeDialog}
        props={{ providerId }}
      />

      {/* This is needed because it's a custom modal, not one created using MUI */}
      {_openDialog.dialog === DIALOGS.ViewProvider && (
        <ViewProviderDialog
          open={_openDialog.dialog === DIALOGS.ViewProvider}
          onClose={closeDialog}
          props={{ title, description, providerId }}
        />
      )}

      <GroupDialog
        open={_openDialog.dialog === DIALOGS.GroupDialog}
        onClose={closeDialog}
        {...{ groupId }}
      />

      {children}
    </DialogsContext.Provider>
  );
};

export default DialogsProvider;
