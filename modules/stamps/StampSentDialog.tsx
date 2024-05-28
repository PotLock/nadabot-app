import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { Routes } from "@nadabot/common/constants";
import CustomButton from "@nadabot/common/ui/components/CustomButton";

export type StampSentDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const StampSentDialog: React.FC<StampSentDialogProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();

  const okHandler = useCallback(() => {
    router.push(Routes.HOME);
    onClose();
  }, [onClose, router]);

  return (
    <Dialog open={open} onClose={okHandler} className="custom-dialogs">
      <DialogTitle>Done</DialogTitle>
      <DialogContent>
        <DialogContentText>Stamp sent successfully!</DialogContentText>
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
};
