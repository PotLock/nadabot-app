import { Avatar, Button, Container, Divider, Link, Stack } from "@mui/material";
import { useCallback } from "react";
import useWeb3Auth from "@nadabot/hooks/useWeb3Auth";
import NadabotLogo from "@nadabot/assets/icons/nadabot-logo";
import { wallet } from "@nadabot/services/web3";
import { BellIcon } from "@nadabot/theme/icons";
import colors from "@nadabot/theme/colors";

const NavBar = () => {
  const { isWalletConnected, accountId } = useWeb3Auth();

  // TODO: isAdmin
  console.info("TODO: isAdmin");
  const isAdmin = true;

  const connectWalletHandler = useCallback(() => {
    wallet.startUp(true);
  }, []);

  const viewAdminHandler = useCallback(() => {
    console.log("TODO: View Admin Dashboard");
  }, []);

  return (
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
          direction="row"
          height={96}
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Left */}
          <NadabotLogo />

          {/* Right */}
          <Stack>
            {isWalletConnected && (
              <Stack direction="row">
                {isAdmin && (
                  <Link
                    component="button"
                    variant="body2"
                    sx={{ mr: 4 }}
                    onClick={viewAdminHandler}
                  >
                    View Admin Dashboard
                  </Link>
                )}
                <Stack
                  direction="row"
                  width={244}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <BellIcon sx={{ width: 14 }} />
                  <Divider
                    orientation="vertical"
                    sx={{ bgcolor: colors.PRIMARY }}
                    flexItem
                  />
                  <Avatar
                    sx={{ background: colors.PRIMARY, width: 36, height: 36 }}
                  >
                    {accountId[0]}
                  </Avatar>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    disableRipple
                  >
                    Not A Human
                  </Button>
                </Stack>
              </Stack>
            )}

            {!isWalletConnected && (
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
  );
};

export default NavBar;
