import NoConnectedDialog from "@nadabot/components/dialogs/NoConnectedDialog";
import { FC, createContext, useCallback, useState } from "react";

export enum DIALOGS {
  None,
  NoConnected,
}

type openDialogProps = {
  dialog: DIALOGS;
  onClickOk?: () => void;
  onClickCancel?: () => void;
};

export const DialogsContext = createContext({
  openDialog: (props: openDialogProps) => {
    throw new Error("openDialog must be defined");
    return;
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

  const openDialog = useCallback((props: openDialogProps) => {
    setOpenDialog({
      _onClickOk: props.onClickOk ? props.onClickOk : () => {},
      _onClickCancel: props.onClickCancel ? props.onClickCancel : () => {},
      dialog: props.dialog,
    });
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
    </DialogsContext.Provider>
  );
};

export default DialogsProvider;
