import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useCallback } from "react";

import { DialogProps } from "@nadabot/components/dialogs/DialogsProvider";

import CustomButton from "../../common/ui/components/CustomButton";

type Props = {
  open: boolean;
  onClose: () => void;
  props?: DialogProps;
};

export default function ErrorDialog({ open, onClose, props }: Props) {
  const okHandler = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={onClose} className="custom-dialogs">
      <DialogTitle>{props?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props?.description}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <CustomButton
          onClick={okHandler}
          fontSize="small"
          bodySize="medium"
          color="blue"
        >
          Ok
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
