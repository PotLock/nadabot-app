import { useCallback, useState } from "react";

import {
  DIALOGS,
  DialogParameters,
  DialogProps,
  DialogsContext,
} from "@nadabot/common/contexts/dialogs";
import { GroupDialog } from "@nadabot/features/groups/GroupDialog";
import { StampDialog } from "@nadabot/features/stamps/StampDialog";
import { StampSentDialog } from "@nadabot/features/stamps/StampSentDialog";

import ConfirmVerificationDialog from "./ConfirmVerificationDialog";
import ErrorDialog from "./ErrorDialog";
import NoConnectedDialog from "./NoConnectedDialog";

type DialogsProviderProps = {
  children: JSX.Element;
};

const DialogsProvider: React.FC<DialogsProviderProps> = ({ children }) => {
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
      setGroupId(props?.groupId);
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
        <StampDialog
          open={_openDialog.dialog === DIALOGS.ViewProvider}
          onClose={closeDialog}
          props={{ title, description, providerId }}
        />
      )}

      {_openDialog.dialog === DIALOGS.GroupDialog && (
        <GroupDialog
          open={_openDialog.dialog === DIALOGS.GroupDialog}
          onClose={closeDialog}
          {...{ groupId }}
        />
      )}

      {children}
    </DialogsContext.Provider>
  );
};

export default DialogsProvider;
