import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  Chip,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { DIALOGS } from "@nadabot/contexts/DialogsProvider";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useDialogs from "@nadabot/hooks/useDialogs";
import useProviderStatusChecker from "@nadabot/hooks/useProviderStatusChecker";
import useSnackbars from "@nadabot/hooks/useSnackbars";
import useSpinner from "@nadabot/hooks/useSpinner";
import { Routes } from "@nadabot/routes";
import * as contract from "@nadabot/services/contracts/sybil.nadabot";
import {
  ProviderExternalWithIsHuman,
  ProviderStatus,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";
import removeViewStampFromURLQuery from "@nadabot/utils/removeViewStampFromURLQuery";

import ButtonContainer from "./containers/ButtonContainer";
import { ProviderSettings } from "./ProviderSettings";
import CustomAvatar from "./ui/CustomAvatar";
import CustomButton from "./ui/CustomButton";
import CustomCircularProgress from "./ui/CustomCircularProgress";

type Props = {
  hidePoints?: boolean;
  sx?: SxProps<Theme>;
  colorSystem?: "regular" | "admin";
  providerInfo: ProviderExternalWithIsHuman;
  isPreview?: boolean;
  isStamp?: boolean;
  verifyButtonSx?: SxProps<Theme>;
  adminView?: boolean;
};

export default function ContractInfo({
  hidePoints,
  sx,
  providerInfo,
  isPreview,
  colorSystem = "regular",
  isStamp,
  verifyButtonSx,
  adminView,
}: Props) {
  const [isAdmin] = useState(adminView || false);
  const { updateProvider } = useProviders();
  const { maxWidth430 } = useBreakPoints();
  const { openDialog } = useDialogs();
  const { showSpinner, hideSpinner } = useSpinner();
  const [hasPendingUpdate, setPendingUpdateStatus] = useState(false);
  const { showSnackbar } = useSnackbars();
  const router = useRouter();

  const [isProviderActive] = useState(
    providerInfo.status === ProviderStatus.Active,
  );

  // const expiryDays = millisecondsToDays(providerInfo.stamp_validity_ms ?? null);

  const verifyHandler = useCallback(async () => {
    if (!isPreview && providerInfo.is_user_a_human) {
      showSpinner();

      contract
        .add_stamp(providerInfo.id)
        .catch(console.error)
        .finally(hideSpinner);
    }
  }, [
    isPreview,
    showSpinner,
    hideSpinner,
    providerInfo.id,
    providerInfo.is_user_a_human,
  ]);

  const { saveProvider } = useProviderStatusChecker();

  const getCheckHandler = useCallback(() => {
    if (!isPreview) {
      // Save provider to check if the user is now a human there
      saveProvider(providerInfo.id);

      // Open up the external URL
      window.open(providerInfo.external_url, "_blank");
    }
  }, [isPreview, providerInfo.external_url, providerInfo.id, saveProvider]);

  const imageURL = providerInfo.icon_url
    ? providerInfo.icon_url.replace(
        "https://gateway.pinata.cloud/ipfs/",
        "https://ipfs.io/ipfs/",
      )
    : null;

  // Switch Activation
  const switchActivation = useCallback(async () => {
    if (isPreview) {
      return;
    }

    setPendingUpdateStatus(true);

    if (!isProviderActive) {
      await contract.admin_activate_provider({
        provider_id: providerInfo.id,
        default_weight: providerInfo.default_weight || 0,
      });

      updateProvider({
        provider_id: providerInfo.id,
        default_weight: providerInfo.default_weight || 0,
        status: ProviderStatus.Active,
      });

      showSnackbar({
        description: "Stamp Activated, Check all the Active stamps",
        actionText: "here",
        onClickActionText: () => {
          router.push(Routes.HOME_WITH_FILTERED_CHECKS("active"));
        },
      });
    } else {
      await contract.admin_deactivate_provider({
        provider_id: providerInfo.id,
      });

      updateProvider({
        provider_id: providerInfo.id,
        status: ProviderStatus.Deactivated,
      });
    }

    setPendingUpdateStatus(false);
  }, [
    providerInfo.default_weight,
    providerInfo.id,
    updateProvider,
    router,
    showSnackbar,
    isPreview,
    isProviderActive,
  ]);

  /**
   * Open up the View Provider Dialog
   */
  const openViewProviderDialog = useCallback(() => {
    openDialog({
      dialog: DIALOGS.ViewProvider,
      props: { providerId: providerInfo.id },
    });

    // Set route for this provider view
    const updatedQueryBody = removeViewStampFromURLQuery(router.query);
    const hasPreviousQuery = updatedQueryBody.length > 0;
    const updatedPath = `${router.pathname}${updatedQueryBody}${hasPreviousQuery ? "&" : "?"}`;

    router.replace(`${updatedPath}viewStamp=${providerInfo.id}`);
  }, [openDialog, providerInfo.id, router]);

  return (
    <Stack
      minWidth={maxWidth430 ? "100%" : 352}
      maxWidth={maxWidth430 ? "100%" : 352}
      width="100%"
      sx={{ background: isStamp ? colors.GRAY100 : "transparent", ...sx }}
    >
      <Stack
        p={2}
        sx={{
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
        minHeight={isAdmin ? "336px" : "280px"}
      >
        <Stack direction="row" justifyContent="space-between">
          {/* Circle */}
          <ButtonContainer onClick={openViewProviderDialog}>
            <Box
              bgcolor={"rgba(0, 0,0,.2)"}
              width={80}
              height={80}
              borderRadius={999}
              sx={{
                ...(providerInfo.icon_url
                  ? {
                      backgroundImage: `url(${imageURL})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }
                  : {}),
              }}
            />
          </ButtonContainer>

          {!hidePoints && (
            <Stack alignItems="flex-end">
              <Typography fontWeight={600} fontSize={24}>
                {providerInfo.default_weight}
              </Typography>
              <Typography fontSize={17}>Points</Typography>
            </Stack>
          )}
        </Stack>

        {/* Contract Name */}
        <ButtonContainer onClick={openViewProviderDialog}>
          <Typography
            textAlign="left"
            fontWeight={600}
            fontSize={20}
            mt={3}
            className="ellipsis"
            color={colors.PRIMARY}
          >
            {providerInfo.provider_name || "Contract Title"}
          </Typography>
        </ButtonContainer>

        {/* Contract's accountId and Method */}
        <ButtonContainer onClick={openViewProviderDialog}>
          <Stack direction="row" alignItems="center">
            <Typography
              textAlign="left"
              fontWeight={500}
              fontSize={16}
              color={colors.NEUTRAL}
              mr={1}
              className="stamp-contractid-multiline-ellipsis"
            >
              {providerInfo.contract_id || "contract.name.near"}
            </Typography>

            <Chip
              label={
                providerInfo.method_name
                  ? `${providerInfo.method_name}()`
                  : "IsHuman()"
              }
              variant="outlined"
            />
          </Stack>
        </ButtonContainer>

        {/* Description */}
        <ButtonContainer onClick={openViewProviderDialog}>
          <Typography
            color={colors.PRIMARY}
            textAlign="left"
            fontWeight={400}
            className="stamp-description-multiline-ellipsis"
            mt={2}
            mb={2}
          >
            {providerInfo.description || "No description provided."}
          </Typography>
        </ButtonContainer>

        {isAdmin && (
          <ProviderSettings disabled={hasPendingUpdate} {...{ providerInfo }} />
        )}
      </Stack>

      {/* Author - SUBMITTED BY - section */}
      <Stack
        direction={maxWidth430 ? "column" : "row"}
        justifyContent="space-between"
        p={2}
        sx={{
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: 2,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderTop: "none",
        }}
      >
        <Stack>
          <Typography fontWeight={700} fontSize={12} color={colors.NEUTRAL700}>
            SUBMITTED BY
          </Typography>

          <Stack direction="row" alignItems="center">
            <CustomAvatar
              accountId={providerInfo.submitted_by}
              size={20}
              fontSize={12}
              sx={{ mr: 1 }}
            />

            <Typography
              fontWeight={500}
              color={colors.NEUTRAL400}
              fontSize={16}
              className="ellipsis"
              maxWidth={maxWidth430 ? "100%" : isAdmin ? "180px" : "160px"}
            >
              {providerInfo.submitted_by}
            </Typography>
          </Stack>
        </Stack>

        {/* Footer Buttons */}
        <>
          {isStamp ? (
            <Stack direction="row" alignItems="center">
              <CheckIcon
                sx={{
                  fontSize: 19,
                  color: colors.BLUE,
                  mr: 1,
                  mt: -0.3,
                }}
              />

              <Typography color={colors.BLUE} fontSize={14} fontWeight={600}>
                Verified
              </Typography>
            </Stack>
          ) : (
            <>
              {hasPendingUpdate ? (
                <CustomCircularProgress sx={{ py: 1, pb: 1.7 }} size={30} />
              ) : (
                <>
                  {isAdmin ? (
                    <Stack direction="row">
                      <CustomButton
                        color="beige"
                        bodySize="medium"
                        onClick={switchActivation}
                        sx={{
                          mt: maxWidth430 ? 2 : 0,
                          px: 2,

                          ...(isProviderActive
                            ? {
                                backgroundColor:
                                  colorSystem === "regular"
                                    ? colors.PEACH
                                    : colors.PRIMARY,
                                color:
                                  colorSystem === "regular"
                                    ? colors.PRIMARY
                                    : colors.NEUTRAL50,
                                ":hover": {
                                  backgroundColor:
                                    colorSystem === "regular"
                                      ? colors.PEACH
                                      : colors.NEUTRAL700,
                                },
                              }
                            : {}),
                        }}
                      >
                        {isProviderActive ? "Deactivate" : "Activate"}
                      </CustomButton>
                    </Stack>
                  ) : (
                    <Button
                      variant="contained"
                      color="warning"
                      size="medium"
                      disableRipple
                      onClick={
                        providerInfo.is_user_a_human
                          ? verifyHandler
                          : getCheckHandler
                      }
                      sx={{
                        mt: maxWidth430 ? 2 : 0,
                        ...verifyButtonSx,
                      }}
                    >
                      {providerInfo.is_user_a_human ? "Verify" : "Get Check"}
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </>
      </Stack>
    </Stack>
  );
}
