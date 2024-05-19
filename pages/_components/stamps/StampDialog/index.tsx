import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import colors from "@nadabot/common/ui/colors";
import ButtonContainer from "@nadabot/common/ui/components/ButtonContainer";
import CustomCircularProgress from "@nadabot/common/ui/components/CustomCircularProgress";
import getDocumentResolution from "@nadabot/common/utils/getDocumentResolution";
import removeViewStampFromURLQuery from "@nadabot/common/utils/removeViewStampFromURLQuery";
import useGetProviderById from "@nadabot/hooks/useGetProviderById";

import Description from "./Description";
import Header from "./Header";
import NextProviders from "./NextProviders";
import { DialogProps } from "../../types";

export type StampDialogProps = {
  open: boolean;
  onClose: () => void;
  props?: DialogProps;
};

export default function StampDialog({
  open,
  onClose,
  props,
}: StampDialogProps) {
  const providerInfo = useGetProviderById(props?.providerId);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [open]);

  const onCloseHandler = useCallback(() => {
    // Remove viewStamp query
    const updatedQueryBody = removeViewStampFromURLQuery(router.query);
    router.replace(`${router.pathname}${updatedQueryBody}`);

    onClose();
  }, [onClose, router]);

  if (!open) {
    return;
  }

  const { height: documentHeight } = getDocumentResolution();

  return (
    <Stack
      width="100vw"
      height={documentHeight}
      bgcolor="rgba(0, 0, 0, 0.50)"
      zIndex={999}
      position="absolute"
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
        mt={4}
      >
        {/* Close Button */}
        <Stack alignItems="flex-end">
          <ButtonContainer onClick={onCloseHandler}>
            <CloseIcon sx={{ m: 2, mb: 0, mr: -2, color: colors.PRIMARY }} />
          </ButtonContainer>
        </Stack>
        {!providerInfo ? (
          <CustomCircularProgress sx={{ py: 1, pb: 1.7 }} size={30} />
        ) : (
          <Stack sx={{ pt: 1 }}>
            <Header providerInfo={providerInfo} />
            <Description providerInfo={providerInfo} />
            <NextProviders providerInfo={providerInfo} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
