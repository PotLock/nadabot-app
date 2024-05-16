import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useCallback } from "react";

import { walletApi } from "@nadabot/common/services/contracts";

import CustomButton from "../../common/ui/CustomButton";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NoConnectedDialog({ open, onClose }: Props) {
  const connectWalletHandler = useCallback(() => {
    walletApi.signInModal();
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={onClose} className="custom-dialogs">
      <DialogTitle>Your wallet isn&apos;t connected</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You need to connect your wallet first!
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <CustomButton
          onClick={connectWalletHandler}
          fontSize="small"
          bodySize="medium"
          color="blue"
        >
          Connect Wallet
        </CustomButton>

        <CustomButton
          onClick={onClose}
          fontSize="small"
          bodySize="medium"
          color="beige"
        >
          Close
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
