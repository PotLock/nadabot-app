import { Button, Container, Divider, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";

import NadabotLogo from "@nadabot/common/assets/icons/nadabot-logo";
import { walletApi } from "@nadabot/common/services/contracts";
import ButtonContainer from "@nadabot/common/ui/components/ButtonContainer";
import Tag from "@nadabot/common/ui/components/Tag";
import colors from "@nadabot/common/ui/theme/colors";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useIsAdminPage from "@nadabot/hooks/useIsAdminPage";
import { Routes } from "@nadabot/routes";

import NotificationDropbox from "./NotificationDropbox";
import UserDropbox from "./UserDropbox";

const NavBar = () => {
  const router = useRouter();
  const { walletConnected, isAdmin, isVerifiedHuman } = useUser();
  const { maxWidth430 } = useBreakPoints();
  const isAdminPage = useIsAdminPage();

  const goHomeHandler = useCallback(() => {
    router.push(Routes.HOME);
  }, [router]);

  const connectWalletHandler = useCallback(() => {
    walletApi.signInModal();
  }, []);

  // Environment indicator (staging and testnet only)
  let hostEnv = window.location.host.includes("staging")
    ? "staging"
    : window.location.host.includes("testnet")
      ? "testnet"
      : null;

  hostEnv = window.location.host.includes("localhost") ? "testnet" : hostEnv;

  return (
    <>
      {/* Environment Indicator */}
      {hostEnv && (
        <Stack alignItems="center" mb={2} bgcolor={colors.NEUTRAL100}>
          <Typography fontWeight={600} py={2}>
            <strong>network:</strong> {hostEnv}
          </Typography>
        </Stack>
      )}

      <Stack
        direction="row"
        width="100%"
        sx={{
          borderBottomWidth: "1px",
          borderBottomColor: colors.LIGHTGRAY,
          borderBottomStyle: "solid",
          mb: 3,
        }}
      >
        <Container>
          <Stack
            direction={maxWidth430 && walletConnected ? "column" : "row"}
            height={maxWidth430 ? "fit-content" : 96}
            justifyContent="space-between"
            alignItems="center"
            my={maxWidth430 ? 2 : 0}
          >
            {/* Left */}
            <ButtonContainer onClick={goHomeHandler}>
              <NadabotLogo />
            </ButtonContainer>

            {/* Right */}
            <Stack>
              {walletConnected ? (
                <Stack direction="row" mb={maxWidth430 ? 2 : 0}>
                  <Stack
                    direction={maxWidth430 ? "column" : "row"}
                    width={isAdmin ? (isAdminPage ? 300 : 350) : 300}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {!isAdminPage && (
                      <>
                        <NotificationDropbox />{" "}
                        <Divider
                          orientation="vertical"
                          sx={{
                            bgcolor: colors.PRIMARY,
                            display: maxWidth430 ? "none" : "block",
                          }}
                          flexItem
                        />
                      </>
                    )}
                    <UserDropbox />
                    <Tag
                      sx={{ mt: maxWidth430 ? 1 : 0 }}
                      type={isVerifiedHuman ? "blue" : "red"}
                      label={isVerifiedHuman ? "Verified Human" : "Not A Human"}
                    />
                  </Stack>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disableRipple
                  onClick={connectWalletHandler}
                >
                  Login
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Stack>
    </>
  );
};

export default NavBar;
