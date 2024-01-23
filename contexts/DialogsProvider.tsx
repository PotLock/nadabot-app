import { FC, createContext, useCallback, useState } from "react";

import ErrorDialog from "@nadabot/components/dialogs/ErrorDialog";
import NoConnectedDialog from "@nadabot/components/dialogs/NoConnectedDialog";
import StampSentDialog from "@nadabot/components/dialogs/StampSentDialog";
import ViewProviderDialog from "@nadabot/components/dialogs/ViewProviderDialog";

export enum DIALOGS {
  None,
  NoConnected,
  StampSent,
  Error,
  ViewProvider,
}

export type DialogProps = {
  title?: string;
  description?: string;
  providerId?: string;
};

type openDialogProps = {
  dialog: DIALOGS;
  props?: DialogProps;
  onClickOk?: () => void;
  onClickCancel?: () => void;
};

type DialogContextProps = {
  openDialog: (props: openDialogProps) => void;
};

export const DialogsContext = createContext<DialogContextProps>({
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

  const [props, setProps] = useState<DialogProps>({});

  const openDialog = useCallback((props: openDialogProps) => {
    setOpenDialog({
      _onClickOk: props.onClickOk ? props.onClickOk : () => {},
      _onClickCancel: props.onClickCancel ? props.onClickCancel : () => {},
      dialog: props.dialog,
    });

    setProps(props.props || {});
  }, []);

  const closeDialog = useCallback(() => {
    setOpenDialog({
      _onClickOk: () => {},
      _onClickCancel: () => {},
      dialog: DIALOGS.None,
    });
  }, []);

  return (
    <DialogsContext.Provider value={{ openDialog }}>
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
        props={props}
      />
      <ViewProviderDialog
        open={_openDialog.dialog === DIALOGS.ViewProvider}
        onClose={closeDialog}
        props={props}
      />
      {children}
    </DialogsContext.Provider>
  );
};

export default DialogsProvider;
