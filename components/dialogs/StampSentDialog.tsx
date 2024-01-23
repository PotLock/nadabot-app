import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { Routes } from "@nadabot/routes";

import CustomButton from "../ui/CustomButton";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function StampSentDialog({ open, onClose }: Props) {
  const router = useRouter();

  const okHandler = useCallback(() => {
    router.push(Routes.HOME);
    onClose();
  }, [onClose, router]);

  return (
    <Dialog open={open} onClose={okHandler}>
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
}
