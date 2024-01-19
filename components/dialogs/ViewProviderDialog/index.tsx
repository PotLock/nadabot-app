import { useCallback } from "react";
import { Dialog, DialogContent, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DialogProps } from "@nadabot/contexts/DialogsProvider";
import useGetProviderById from "@nadabot/hooks/useGetProviderById";
import colors from "@nadabot/theme/colors";
import ButtonContainer from "@nadabot/components/containers/ButtonContainer";
import Header from "./components/Header";
import Description from "./components/Description";

type Props = {
  open: boolean;
  onClose: () => void;
  props?: DialogProps;
};

export default function ViewProviderDialog({ open, onClose, props }: Props) {
  const providerInfo = useGetProviderById(props?.providerId);

  const okHandler = useCallback(() => {
    onClose();
  }, [onClose]);

  // rgba(0, 0, 0, 0.87)
  if (!open) {
    return;
  }

  return (
    <Stack
      width="100vw"
      height="100vh"
      bgcolor="rgba(0, 0, 0, 0.50)"
      zIndex={999}
      position="fixed"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Stack
        maxWidth={1298}
        width="100%"
        bgcolor={colors.WHITE}
        borderRadius="24px"
        p={4}
        pt={0}
      >
        {/* Close Button */}
        <Stack alignItems="flex-end">
          <ButtonContainer onClick={onClose}>
            <CloseIcon sx={{ m: 2, mb: 0, mr: -2 }} />
          </ButtonContainer>
        </Stack>
        <Stack sx={{ pt: 1 }}>
          <Header providerInfo={providerInfo} />
          <Description providerInfo={providerInfo} />
        </Stack>
      </Stack>
    </Stack>
  );
}
