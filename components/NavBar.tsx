import { Avatar, Button, Container, Divider, Link, Stack } from "@mui/material";
import { useCallback } from "react";
import NadabotLogo from "@nadabot/assets/icons/nadabot-logo";
import { BellIcon } from "@nadabot/theme/icons";
import colors from "@nadabot/theme/colors";
import { useUser } from "@nadabot/hooks/store/useUser";
import { walletApi } from "@nadabot/services/web3/web3api";
import Tag from "./ui/Tag";

const NavBar = () => {
  const { walletConnected, isAdmin, accountId } = useUser();

  // TODO: check if it's a verified human
  const isVerifiedHuman = false;

  const connectWalletHandler = useCallback(() => {
    walletApi.signInModal();
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
            {walletConnected && (
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
                    sx={{
                      background: colors.PRIMARY,
                      width: 36,
                      height: 36,
                      fontSize: 14,
                    }}
                  >
                    {accountId[0]}
                  </Avatar>
                  <Tag
                    label={
                      isAdmin || isVerifiedHuman
                        ? "Verified Human"
                        : "Not A Human"
                    }
                  />
                </Stack>
              </Stack>
            )}

            {!walletConnected && (
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
