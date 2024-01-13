import { useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CustomButton from "../ui/CustomButton";
import { DialogProps } from "@nadabot/contexts/DialogsProvider";

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
    <Dialog open={open} onClose={onClose}>
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
