import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
  Button,
  Chip,
  Slider,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

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

  const verifyHandler = useCallback(async () => {
    if (isPreview) {
      return;
    }

    showSpinner();
    // Call add_stamp method
    if (providerInfo.is_user_a_human) {
      try {
        await contract.add_stamp(providerInfo.provider_id);
      } catch (error) {
        console.error(error);
      }
      hideSpinner();
    }
  }, [
    isPreview,
    showSpinner,
    hideSpinner,
    providerInfo.provider_id,
    providerInfo.is_user_a_human,
  ]);

  const { saveProvider } = useProviderStatusChecker();

  const getCheckHandler = useCallback(() => {
    if (isPreview) {
      return;
    }

    // Save provider to check if the user is now a human there
    saveProvider(providerInfo.provider_id);

    // Open up the external URL
    window.open(providerInfo.external_url, "_blank");
  }, [
    isPreview,
    providerInfo.external_url,
    providerInfo.provider_id,
    saveProvider,
  ]);

  const [points, setPoints] = useState(providerInfo.default_weight);
  const [previousPoints, setPreviousPoints] = useState(
    providerInfo.default_weight,
  );
  const debouncedPoints = useDebounce(points, 800);
  const [updating, setUpdating] = useState(false);
  const { showSnackbar } = useSnackbars();
  const router = useRouter();

  const imageURL = providerInfo.icon_url
    ? providerInfo.icon_url.replace(
        "https://gateway.pinata.cloud/ipfs/",
        "https://ipfs.io/ipfs/",
      )
    : null;

  // Check if it's needed to update the Provider points
  useEffect(() => {
    if (isPreview) {
      setPreviousPoints(debouncedPoints);
      return;
    }

    if (debouncedPoints !== previousPoints) {
      // Update this Provider points
      (async () => {
        setUpdating(true);
        await contract.update_provider({
          provider_id: providerInfo.provider_id,
          default_weight: debouncedPoints,
        });
        setUpdating(false);
        setPreviousPoints(debouncedPoints);

        // Update this provider withing store
        updateProvider({
          provider_id: providerInfo.provider_id,
          default_weight: debouncedPoints,
        });
      })();
    }
  }, [
    debouncedPoints,
    points,
    previousPoints,
    providerInfo.provider_id,
    isPreview,
    updateProvider,
  ]);

  const changePointsHandler = useCallback(async (newValue: number) => {
    setPoints(newValue);
  }, []);

  const [isProviderActive] = useState(
    providerInfo.status === ProviderStatus.Active,
  );

  // Switch Activation
  const switchActivation = useCallback(async () => {
    if (isPreview) {
      return;
    }

    setUpdating(true);
    if (!isProviderActive) {
      await contract.admin_activate_provider({
        provider_id: providerInfo.provider_id,
        default_weight: providerInfo.default_weight || 0,
      });
      updateProvider({
        provider_id: providerInfo.provider_id,
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
        provider_id: providerInfo.provider_id,
      });
      updateProvider({
        provider_id: providerInfo.provider_id,
        status: ProviderStatus.Deactivated,
      });
    }
    setUpdating(false);
  }, [
    providerInfo.default_weight,
    providerInfo.provider_id,
    updateProvider,
    router,
    showSnackbar,
    isPreview,
    isProviderActive,
  ]);

  // Active / De-Activate
  const [activeLabel, setActiveLabel] = useState("Active");
  const activeMouseOverHandler = useCallback(() => {
    setActiveLabel("De-Activate");
  }, []);

  const activeMouseOutHandler = useCallback(() => {
    setActiveLabel("Active");
  }, []);

  /**
   * Open up the View Provider Dialog
   */
  const openViewProviderDialog = useCallback(() => {
    openDialog({
      dialog: DIALOGS.ViewProvider,
      props: { providerId: providerInfo.provider_id },
    });

    // Set route for this provider view
    const updatedQueryBody = removeViewStampFromURLQuery(router.query);
    const hasPreviousQuery = updatedQueryBody.length > 0;
    const updatedPath = `${router.pathname}${updatedQueryBody}${hasPreviousQuery ? "&" : "?"}`;

    router.replace(`${updatedPath}viewStamp=${providerInfo.provider_id}`);
  }, [openDialog, providerInfo.provider_id, router]);

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
                {previousPoints}
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
            {providerInfo.name || "Contract Title"}
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
            {providerInfo.description ||
              "Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod tempor ncididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
          </Typography>
        </ButtonContainer>

        {/* Edit Points */}
        {isAdmin && (
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row">
                <Typography fontWeight={600} mr={1}>
                  Edit Points
                </Typography>
                <InfoOutlinedIcon
                  sx={{ color: colors.NEUTRAL300, width: 16 }}
                />
              </Stack>
              <Stack
                borderRadius="4px"
                border={`1px solid ${colors.NEUTRAL100}`}
              >
                <Typography fontWeight={600} color={colors.NEUTRAL500} px={1}>
                  {previousPoints} pts
                </Typography>
              </Stack>
            </Stack>
            {updating ? (
              <CustomCircularProgress sx={{ py: 1 }} size={30} />
            ) : (
              <Slider
                value={points}
                // NOTE: Check this with Lachlan
                max={100}
                min={1}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(_, newValue) =>
                  changePointsHandler(newValue as number)
                }
              />
            )}
          </Stack>
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
              {updating ? (
                <CustomCircularProgress sx={{ py: 1, pb: 1.7 }} size={30} />
              ) : (
                <>
                  {isAdmin ? (
                    <Stack direction="row">
                      <CustomButton
                        color="beige"
                        bodySize="medium"
                        onClick={switchActivation}
                        onMouseOver={activeMouseOverHandler}
                        onMouseOut={activeMouseOutHandler}
                        sx={{
                          mt: maxWidth430 ? 2 : 0,
                          px: 2,
                          ...(activeLabel === "De-Activate" && isProviderActive
                            ? { px: 1 }
                            : {}),
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
                        {isProviderActive ? activeLabel : "Activate"}
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
