import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import ButtonContainer from "@nadabot/components/containers/ButtonContainer";
import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import { DialogProps } from "@nadabot/contexts/DialogsProvider";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useGetProviderById from "@nadabot/hooks/useGetProviderById";
import colors from "@nadabot/theme/colors";
import removeViewStampFromURLQuery from "@nadabot/utils/removeViewStampFromURLQuery";

import Description from "./components/Description";
import Header from "./components/Header";
import NextProviders from "./components/NextProviders";

type Props = {
  open: boolean;
  onClose: () => void;
  props?: DialogProps;
};

export default function ViewProviderDialog({ open, onClose, props }: Props) {
  const providerInfo = useGetProviderById(props?.providerId);
  const { maxWidth962 } = useBreakPoints();
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

  return (
    <Stack
      width="100vw"
      height={maxWidth962 ? "200%" : "250%"}
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
            <CloseIcon sx={{ m: 2, mb: 0, mr: -2 }} />
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
