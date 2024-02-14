import { Menu, Stack } from "@mui/material";
import { useState } from "react";

import ButtonContainer from "@nadabot/components/containers/ButtonContainer";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useIsHumanFilteredProviders from "@nadabot/hooks/useIsHumanFilteredProviders";
import { BellIcon, BellNotificationIcon } from "@nadabot/theme/icons";
import providerSorts from "@nadabot/utils/providerSorts";

import PendingVerification from "./PendingVerification";

const NotificationDropbox = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { maxWidth430 } = useBreakPoints();
  const { activeIsHuman } = useIsHumanFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });
  const hasPendingVerification = activeIsHuman.length > 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hasPendingVerification) {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
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
        >
          {hasPendingVerification ? (
            <BellNotificationIcon
              sx={{
                width: 14,
                display: maxWidth430 ? "none" : "block",
              }}
            />
          ) : (
            <BellIcon
              sx={{
                width: 14,
                display: maxWidth430 ? "none" : "block",
              }}
            />
          )}
        </Stack>
      </ButtonContainer>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="notification-dropbox"
      >
        <Stack direction="row" alignItems="center" ml={2} mb={2}>
          <PendingVerification providers={activeIsHuman} />
        </Stack>
      </Menu>
    </>
  );
};

export default NotificationDropbox;
