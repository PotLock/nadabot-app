import { Menu, Stack } from "@mui/material";
import { createRef, useEffect, useState } from "react";

import ButtonContainer from "@nadabot/components/containers/ButtonContainer";
import { useNotificationController } from "@nadabot/hooks/store/useNotificationController";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";
import { BellIcon, BellNotificationIcon } from "@nadabot/theme/icons";
import providerSorts from "@nadabot/utils/providerSorts";

import PendingVerification from "./PendingVerification";

const NotificationDropbox = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const { maxWidth430 } = useBreakPoints();
  const {
    setPendingVerification,
    hasPendingVerification,
    notificationWasDisplayed,
    wasNotificationDisplayed,
    loginTime,
  } = useNotificationController();
  const { activeIsHuman } = useFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });

  const notificationButtonRef = createRef<HTMLButtonElement>();

  // Pending verification
  useEffect(() => {
    setPendingVerification(activeIsHuman.length > 0);
  }, [setPendingVerification, activeIsHuman]);

  // Check if notification was displayed.
  // If user logs in and there is any notification,
  // auto show the notification(s)
  useEffect(() => {
    if (
      hasPendingVerification &&
      !wasNotificationDisplayed &&
      notificationButtonRef.current &&
      loginTime &&
      Date.now() < loginTime + 5000 // 5 sec of interval between login and reach out this line
    ) {
      notificationButtonRef.current.click();
    }
  }, [
    wasNotificationDisplayed,
    hasPendingVerification,
    notificationButtonRef,
    loginTime,
  ]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hasPendingVerification) {
      setAnchorEl(event.currentTarget);
      setOpen(true);
      notificationWasDisplayed();
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
        ref={notificationButtonRef}
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
