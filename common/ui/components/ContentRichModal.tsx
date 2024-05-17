import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import { useEffect } from "react";

import getDocumentResolution from "@nadabot/common/utils/getDocumentResolution";

import ButtonContainer from "./ButtonContainer";
import colors from "../theme/colors";

export type ContentRichModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const ContentRichModal: React.FC<ContentRichModalProps> = ({
  open,
  onClose,
  children,
}) => {
  const { height: documentHeight } = getDocumentResolution();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [open]);

  return !open ? null : (
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
        mt={4}
        borderRadius="24px"
        p={4}
        pt={0}
        width="100%"
        maxWidth={1298}
        bgcolor={colors.WHITE}
      >
        {/* Close Button */}
        <Stack alignItems="flex-end">
          <ButtonContainer onClick={onClose}>
            <CloseIcon sx={{ m: 2, mb: 0, mr: -2, color: colors.PRIMARY }} />
          </ButtonContainer>
        </Stack>

        <Stack gap={2}>{children}</Stack>
      </Stack>
    </Stack>
  );
};
