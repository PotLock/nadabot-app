import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useCallback } from "react";

import CustomButton from "@nadabot/common/ui/components/CustomButton";

import { DialogProps } from "../types";

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
