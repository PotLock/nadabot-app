import ErrorDialog from "@nadabot/components/dialogs/ErrorDialog";
import NoConnectedDialog from "@nadabot/components/dialogs/NoConnectedDialog";
import StampSentDialog from "@nadabot/components/dialogs/StampSentDialog";
import { FC, createContext, useCallback, useState } from "react";

export enum DIALOGS {
  None,
  NoConnected,
  StampSent,
  Error,
}

export type DialogProps = {
  title?: string;
  description?: string;
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
      {children}
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
    </DialogsContext.Provider>
  );
};

export default DialogsProvider;
