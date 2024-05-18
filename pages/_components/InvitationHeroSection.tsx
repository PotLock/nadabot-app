import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";

import redLines from "@nadabot/common/assets/svgs/red-lines.svg";
import { Routes } from "@nadabot/common/constants";
import colors from "@nadabot/common/ui/theme/colors";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useDialogs from "@nadabot/hooks/useDialogs";
import useWeb3Auth from "@nadabot/hooks/useWeb3Auth";

import { DIALOGS } from "./types";

const textToTypographySlices = (props: {
  text: string;
  fontSize: number;
  color?: string;
  lineHeight: string;
}) => {
  return props.text.split(" ").map((slice, index) => (
    <Typography
      key={index}
      variant="h3"
      fontWeight={500}
      fontSize={props.fontSize}
      lineHeight={props.lineHeight}
      mr={2}
      color={props.color}
    >
      {slice}
    </Typography>
  ));
};

export default function InvitationHeroSection() {
  const router = useRouter();
  const { maxWidth962 } = useBreakPoints();
  const { isWalletConnected } = useWeb3Auth();
  const { openDialog } = useDialogs();
  const fontSize = maxWidth962 ? 42 : 62;
  const lineHeight = maxWidth962 ? "56px" : "96px";

  const addYouOwnHandler = useCallback(() => {
    if (!isWalletConnected) {
      openDialog({ dialog: DIALOGS.NoConnected });
      return;
    }

    router.push(Routes.ADD_STAMP);
  }, [router, isWalletConnected, openDialog]);

  return (
    <Container
      className="invitation-hero-section-bg"
      sx={{ mt: 2, paddingY: maxWidth962 ? 12 : 16 }}
    >
      <Stack direction="row" flexWrap="wrap">
        {textToTypographySlices({
          text: "Are you someone who provides",
          fontSize,
          lineHeight,
        })}
        {textToTypographySlices({
          text: "wallet authentications",
          fontSize,
          color: colors.BLUE,
          lineHeight,
        })}
        {textToTypographySlices({ text: "for", fontSize, lineHeight })}
        <Stack>
          <Typography
            variant="h3"
            fontWeight={500}
            fontSize={fontSize}
            lineHeight={lineHeight}
            zIndex={1}
          >
            3rd party service?
          </Typography>
          <Image
            src={redLines}
            alt="red lines"
            style={{
              marginTop: maxWidth962 ? -22 : -28,
              width: maxWidth962 ? 336 : 496,
              height: "auto",
            }}
          />
        </Stack>
      </Stack>
      <Stack direction="row" flexWrap="wrap">
        <Box mt={4} mr={3}>
          <Button
            variant="contained"
            color="warning"
            size={maxWidth962 ? "medium" : "large"}
            disableRipple
            sx={{ fontSize: maxWidth962 ? "26px" : "36px" }}
            onClick={addYouOwnHandler}
          >
            Add your own
          </Button>
        </Box>
        {/* <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            size={maxWidth962 ? "medium" : "large"}
            disableRipple
          >
            Check here
          </Button>
        </Box> */}
      </Stack>
    </Container>
  );
}
