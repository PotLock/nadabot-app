import { useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CustomButton from "../ui/CustomButton";
import { useRouter } from "next/router";
import { Routes } from "@nadabot/routes";

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
