import { useCallback } from "react";
import { wallet } from "@nadabot/services/web3";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CustomButton from "../ui/CustomButton";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function NoConnectedDialog({ open, onClose }: Props) {
  const connectWalletHandler = useCallback(() => {
    wallet.startUp(true);
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={onClose}>
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
