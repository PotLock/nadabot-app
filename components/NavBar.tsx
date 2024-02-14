import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Button,
  Container,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import NadabotLogo from "@nadabot/assets/icons/nadabot-logo";
import { NETWORK } from "@nadabot/constants";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useSpinner from "@nadabot/hooks/useSpinner";
import useWeb3Auth from "@nadabot/hooks/useWeb3Auth";
import { Routes } from "@nadabot/routes";
import { walletApi } from "@nadabot/services/contracts";
import colors from "@nadabot/theme/colors";
import { BellIcon } from "@nadabot/theme/icons";
import truncate from "@nadabot/utils/truncate";

import ButtonContainer from "./containers/ButtonContainer";
import CustomAvatar from "./ui/CustomAvatar";
import Tag from "./ui/Tag";

const Dropbox = () => {
  const { accountId, profileInfo, isAdmin } = useUser();
  const { signOut } = useWeb3Auth();
  const { showSpinner } = useSpinner();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { maxWidth430 } = useBreakPoints();
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const adminDashboardHandler = () => {
    handleClose();
    router.push(Routes.ADMIN_HOME);
  };

  const goHomeHandler = () => {
    handleClose();
    router.push(Routes.HOME);
  };

  const visitNearProfileHandler = () => {
    handleClose();

    if (NETWORK === "mainnet") {
      window.open(
        `https://bos.potlock.org/near/widget/ProfilePage?accountId=${accountId}`,
        "_blank",
      );
    } else {
      window.open(
        `https://test.near.org/discom.testnet/widget/ProfilePage?accountId=${accountId}`,
        "_blank",
      );
    }
  };

  const logoutHandle = () => {
    showSpinner(1);
    handleClose();
    signOut();
  };

  return (
    <>
      <ButtonContainer
        id="basic-button"
        onClick={handleClick}
        style={{ marginTop: maxWidth430 ? "12px" : "0px" }}
      >
        <Stack
          direction="row"
          gap="4px"
          alignItems="center"
          justifyContent="center"
          p="6px 8px"
          borderRadius="20px"
          boxShadow="0px -1px 0px 0px #292929 inset, 0px 0px 0px 0.5px #292929"
        >
          <CustomAvatar accountId={accountId} size={24} />
          {isAdmin && (
            <Typography
              sx={{ textDecorationLine: "underline" }}
              fontWeight={600}
              lineHeight="20px"
              fontSize={14}
              ml={0.2}
            >
              Admin
            </Typography>
          )}
          {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowDownIcon />}
        </Stack>
      </ButtonContainer>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Stack direction="row" alignItems="center" ml={2} mb={2}>
          <CustomAvatar accountId={accountId} size={48} fontSize={16} />
          <Typography fontSize={14} fontWeight={500} lineHeight="20px" ml={2}>
            {truncate(profileInfo?.name || accountId, 14)}
          </Typography>
        </Stack>
        {isAdmin && router.route !== Routes.ADMIN_HOME && (
          <MenuItem
            onClick={adminDashboardHandler}
            sx={{
              mb: 2,
              fontWeight: 500,
              lineHeight: "20px",
            }}
          >
            Admin Dashboard
          </MenuItem>
        )}

        {isAdmin && router.route === Routes.ADMIN_HOME && (
          <MenuItem
            onClick={goHomeHandler}
            sx={{
              mb: 2,
              fontWeight: 500,
              lineHeight: "20px",
            }}
          >
            Home
          </MenuItem>
        )}
        <MenuItem
          onClick={visitNearProfileHandler}
          sx={{
            mb: 2,
            fontWeight: 500,
            lineHeight: "20px",
          }}
        >
          Visit Near Profile
        </MenuItem>
        <MenuItem
          onClick={logoutHandle}
          sx={{
            color: colors.ERROR_RED,
            fontWeight: 500,
            lineHeight: "20px",
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

const NavBar = () => {
  const router = useRouter();
  const { walletConnected, isAdmin, isVerifiedHuman } = useUser();
  const { maxWidth430 } = useBreakPoints();

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
                    width={isAdmin ? 350 : 300}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <BellIcon
                      sx={{
                        width: 14,
                        display: maxWidth430 ? "none" : "block",
                      }}
                    />
                    <Divider
                      orientation="vertical"
                      sx={{
                        bgcolor: colors.PRIMARY,
                        display: maxWidth430 ? "none" : "block",
                      }}
                      flexItem
                    />
                    <Dropbox />
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
