import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Menu, MenuItem, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import ButtonContainer from "@nadabot/components/containers/ButtonContainer";
import CustomAvatar from "@nadabot/components/ui/CustomAvatar";
import { NETWORK } from "@nadabot/constants";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useSpinner from "@nadabot/hooks/useSpinner";
import useWeb3Auth from "@nadabot/hooks/useWeb3Auth";
import { Routes } from "@nadabot/routes";
import colors from "@nadabot/theme/colors";
import truncate from "@nadabot/utils/truncate";

const UserDropbox = () => {
  const { accountId, profileInfo, isAdmin } = useUser();
  const { signOut } = useWeb3Auth();
  const { showSpinner, hideSpinner } = useSpinner();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { maxWidth430 } = useBreakPoints();
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setOpen(false);
  }, [setAnchorEl, setOpen]);

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

  const logoutHandle = useCallback(() => {
    showSpinner(1);
    handleClose();
    signOut();
    setTimeout(() => {
      hideSpinner();
    }, 800);
  }, [showSpinner, handleClose, signOut, hideSpinner]);

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
            {truncate(profileInfo?.provider_name || accountId, 14)}
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

export default UserDropbox;
