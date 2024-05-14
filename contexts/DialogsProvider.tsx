import { FC, createContext, useCallback, useState } from "react";

import ConfirmVerificationDialog from "@nadabot/components/dialogs/ConfirmVerificationDialog";
import ErrorDialog from "@nadabot/components/dialogs/ErrorDialog";
import NoConnectedDialog from "@nadabot/components/dialogs/NoConnectedDialog";
import StampSentDialog from "@nadabot/components/dialogs/StampSentDialog";
import ViewProviderDialog from "@nadabot/components/dialogs/ViewProviderDialog";
import { ProviderExternal } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";

export enum DIALOGS {
  None,
  NoConnected,
  StampSent,
  Error,
  ViewProvider,
  ConfirmVerification,
}

export type DialogProps = {
  title?: string;
  description?: string;
  providerId?: ProviderExternal["id"];
};

type openDialogProps = {
  dialog: DIALOGS;
  props?: DialogProps;
  onClickOk?: () => void;
  onClickCancel?: () => void;
};

type DialogContextProps = {
  openDialog: (props: openDialogProps) => void;
  currentDialog: DIALOGS;
};

export const DialogsContext = createContext<DialogContextProps>({
  currentDialog: DIALOGS.None,
  openDialog: () => {
    throw new Error("openDialog must be defined");
  },
});

type Props = {
  children: JSX.Element;
};

const DialogsProvider: FC<Props> = ({ children }) => {
  const [_openDialog, setOpenDialog] = useState({
    _onClickOk: () => {},
    _onClickCancel: () => {},
    dialog: DIALOGS.None,
  });

  // Dialog Props
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [providerId, setProviderId] = useState<ProviderExternal["id"]>();

  const openDialog = useCallback((props: openDialogProps) => {
    setOpenDialog({
      _onClickOk: props.onClickOk ? props.onClickOk : () => {},
      _onClickCancel: props.onClickCancel ? props.onClickCancel : () => {},
      dialog: props.dialog,
    });

    // Props
    setTitle(props.props?.title || "");
    setDescription(props.props?.description || "");
    setProviderId(props.props?.providerId ?? 0);
  }, []);

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
      {children}
    </DialogsContext.Provider>
  );
};

export default DialogsProvider;
