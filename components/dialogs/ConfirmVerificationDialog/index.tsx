import TelegramIcon from "@mui/icons-material/Telegram";
import XIcon from "@mui/icons-material/X";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import copy from "copy-to-clipboard";
import { useCallback, useEffect, useState } from "react";

import NadabotLogo from "@nadabot/assets/icons/nadabot-logo";
import ButtonContainer from "@nadabot/components/containers/ButtonContainer";
import { DialogProps } from "@nadabot/contexts/DialogsProvider";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import useSnackbars from "@nadabot/hooks/useSnackbars";
import { add_stamp } from "@nadabot/services/contracts/sybil.nadabot";
import { ProviderExternal } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";
import { CopyIcon } from "@nadabot/theme/icons";

import CustomButton from "../../ui/CustomButton";

type Props = {
  open: boolean;
  onClose: () => void;
  props?: DialogProps;
};

export default function ConfirmVerificationDialog({
  open,
  onClose,
  props,
}: Props) {
  const { activeIsHuman } = useFilteredProviders({});
  const [provider, setProvider] = useState<ProviderExternal>();
  const [providerLink, setProviderLink] = useState<string>();
  const [loading, isLoading] = useState(false);
  const { showSnackbar } = useSnackbars();

  useEffect(() => {
    if (props?.providerId && activeIsHuman) {
      const _provider = activeIsHuman.find(
        (prov) => prov.id === props.providerId,
      );
      setProvider(_provider);

      // Build provider link
      if (_provider) {
        setProviderLink(`${window.location.origin}/?viewStamp=${_provider.id}`);
      }
    }
  }, [props?.providerId, activeIsHuman]);

  const verifyHandler = useCallback(async () => {
    if (provider) {
      isLoading(true);
      try {
        await add_stamp(provider.id);
      } catch (error) {
        console.error(error);
      }
      isLoading(false);
    }
  }, [provider]);

  const shareTwitter = () => {
    if (providerLink) {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(providerLink)}&text=${encodeURIComponent(`I just got my "${provider?.provider_name}" check using #NadaBot. Take a look here: `)}`,
        "_blank",
      );
    }
  };

  const shareTelegram = () => {
    if (providerLink) {
      window.open(
        `https://telegram.me/share/url?url=${encodeURIComponent(providerLink)}&text=${encodeURIComponent(`I just got my "${provider?.provider_name}" check using NadaBot. Take a look! `)}`,
        "_blank",
      );
    }
  };

  const copyToClipboardHandler = () => {
    if (providerLink) {
      showSnackbar({ description: "Link copied to clipboard!" });
      copy(providerLink);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="custom-dialogs">
      <DialogTitle>
        <Stack alignItems="center">
          <NadabotLogo />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          textAlign="center"
          fontWeight={600}
          fontSize={20}
          color={colors.PRIMARY}
        >
          {"You have done "}
          <span style={{ color: colors.BLUE }}>{provider?.provider_name}</span>
          {"check."}
          <br /> Now add this check to Nada Bot contract.
        </DialogContentText>

        <Stack alignItems="center" mt={6}>
          <Typography
            color={colors.PRIMARY}
            fontWeight={600}
            fontSize={16}
            mb={0.5}
          >
            Let&apos;s show-off a little
          </Typography>

          <ul className="dialog-list-socials">
            <li>
              <ButtonContainer onClick={shareTwitter}>
                <Stack alignItems="center">
                  <XIcon sx={{ width: 22, height: 22 }} />
                  <Typography fontSize={10} color={colors.PRIMARY} mt={0.5}>
                    X
                  </Typography>
                </Stack>
              </ButtonContainer>
            </li>
            <li>
              <ButtonContainer onClick={shareTelegram}>
                <Stack alignItems="center">
                  <TelegramIcon sx={{ width: 24, height: 24 }} />
                  <Typography fontSize={10} color={colors.PRIMARY} mt={0.5}>
                    Telegram
                  </Typography>
                </Stack>
              </ButtonContainer>
            </li>
            <li>
              <ButtonContainer onClick={copyToClipboardHandler}>
                <Stack alignItems="center">
                  <CopyIcon sx={{ width: 24, height: 24 }} />
                  <Typography fontSize={10} color={colors.PRIMARY} mt={0.5}>
                    Copy
                  </Typography>
                </Stack>
              </ButtonContainer>
            </li>
          </ul>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ mt: 1 }}>
        {loading ? (
          <Stack
            alignItems="center"
            py={3}
            justifyContent="center"
            width="100%"
          >
            <CircularProgress size={24} sx={{ color: "#464646" }} />
          </Stack>
        ) : (
          <CustomButton
            onClick={verifyHandler}
            fontSize="medium"
            bodySize="large"
            color="beige"
            sx={{
              width: "100%",
              backgroundColor: "#464646",
              color: "#FEF6EE",
              ":hover": { backgroundColor: "#5c5c5c", color: "#FEF6EE" },
            }}
          >
            Confirm Verification
          </CustomButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
