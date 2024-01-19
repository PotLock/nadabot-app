import {
  Avatar,
  Box,
  Button,
  Chip,
  Slider,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRouter } from "next/router";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import colors from "@nadabot/theme/colors";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import CustomCircularProgress from "./ui/CustomCircularProgress";
import * as contract from "@nadabot/services/web3/contract-interface";
import { useUser } from "@nadabot/hooks/store/useUser";
import CustomButton from "./ui/CustomButton";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import useDialogs from "@nadabot/hooks/useDialogs";
import { DIALOGS } from "@nadabot/contexts/DialogsProvider";
import ButtonContainer from "./containers/ButtonContainer";
import useSnackbars from "@nadabot/hooks/useSnackbars";
import { Routes } from "@nadabot/routes";

type Props = {
  hidePoints?: boolean;
  sx?: SxProps<Theme>;
  colorSystem?: "regular" | "admin";
  details: {
    isFlagged?: boolean;
    isActive?: boolean;
    providerId: string;
    title: string;
    imageURL?: string;
    contractName: string;
    method: string;
    description: string;
    submittedByAccountId: string;
    points?: number;
  };
  isPreview?: boolean;
};

export default function ContractInfo({
  hidePoints,
  sx,
  details,
  isPreview,
  colorSystem = "regular",
}: Props) {
  const { isAdmin } = useUser();
  const { updateProvider } = useProviders();
  const { maxWidth430 } = useBreakPoints();
  const { openDialog } = useDialogs();

  const verifyHandler = useCallback(() => {
    if (!isPreview) {
      // Handle here
    }
  }, [isPreview]);

  const [points, setPoints] = useState(details.points);
  const [previousPoints, setPreviousPoints] = useState(details.points);
  const debouncedPoints = useDebounce(points, 1200);
  const [updating, setUpdating] = useState(false);
  const { showSnackbar } = useSnackbars();
  const router = useRouter();

  const imageURL = details.imageURL
    ? details.imageURL.replace(
        "https://gateway.pinata.cloud/ipfs/",
        "https://ipfs.io/ipfs/"
      )
    : null;

  // Check if it's needed to update the Provider points
  useEffect(() => {
    if (debouncedPoints !== previousPoints) {
      // Update this Provider points
      (async () => {
        setUpdating(true);
        await contract.update_provider({
          provider_id: details.providerId,
          default_weight: debouncedPoints,
        });
        setUpdating(false);
        setPreviousPoints(debouncedPoints);
      })();
    }
  }, [debouncedPoints, points, previousPoints, details.providerId]);

  const changePointsHandler = useCallback(async (newValue: number) => {
    setPoints(newValue);
  }, []);

  // Switch Activation
  const switchActivation = useCallback(async () => {
    setUpdating(true);
    if (!details.isActive) {
      await contract.admin_activate_provider({
        provider_id: details.providerId,
        default_weight: details.points || 0,
      });
      updateProvider({
        provider_id: details.providerId,
        default_weight: details.points || 0,
        is_active: true,
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
        provider_id: details.providerId,
      });
      updateProvider({ provider_id: details.providerId, is_active: false });
    }
    setUpdating(false);
  }, [
    details.isActive,
    details.points,
    details.providerId,
    updateProvider,
    router,
    showSnackbar,
  ]);

  // Switch Flag
  const switchFlag = useCallback(async () => {
    setUpdating(true);
    if (!details.isFlagged) {
      await contract.admin_flag_provider({
        provider_id: details.providerId,
      });
      updateProvider({
        provider_id: details.providerId,
        is_flagged: true,
      });

      showSnackbar({
        bgColor: "red",
        description: "Stamp Flagged, Check all the flagged stamps",
        actionText: "here",
        onClickActionText: () => {
          router.push(Routes.HOME_WITH_FILTERED_CHECKS("flagged"));
        },
      });
    } else {
      await contract.admin_unflag_provider({
        provider_id: details.providerId,
      });
      updateProvider({ provider_id: details.providerId, is_flagged: false });
    }
    setUpdating(false);
  }, [
    details.isFlagged,
    details.providerId,
    updateProvider,
    router,
    showSnackbar,
  ]);

  // Active / De-Activate
  const [activeLabel, setActiveLabel] = useState("Active");
  const activeMouseOverHandler = useCallback(() => {
    setActiveLabel("De-Activate");
  }, []);

  const activeMouseOutHandler = useCallback(() => {
    setActiveLabel("Active");
  }, []);

  // Flagged / Unflag
  const [flaggedLabel, setFlaggedLabel] = useState("Flagged");
  const flaggedMouseOverHandler = useCallback(() => {
    setFlaggedLabel("Un-Flag");
  }, []);

  const flaggedMouseOutHandler = useCallback(() => {
    setFlaggedLabel("Flagged");
  }, []);

  /**
   * Open up the View Provider Dialog
   */
  const openViewProviderDialog = useCallback(() => {
    openDialog({
      dialog: DIALOGS.ViewProvider,
      props: { providerId: details.providerId },
    });
  }, [openDialog, details.providerId]);

  return (
    <Stack
      minWidth={maxWidth430 ? 0 : 352}
      maxWidth={maxWidth430 ? "100%" : 352}
      width="100%"
      sx={sx}
    >
      <Stack
        p={2}
        sx={{
          border: `1px solid ${colors.LIGHTGRAY}`,
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
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
                ...(details.imageURL
                  ? {
                      backgroundImage: `url(${imageURL})`,
                      backgroundSize: "cover",
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
          >
            {details.title || "Contract Title"}
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
              {details.contractName || "contract.name.near"}
            </Typography>
            <Chip
              label={details.method ? `${details.method}()` : "IsHuman()"}
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
            {details.description ||
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
            <Avatar
              sx={{
                background: colors.PRIMARY,
                width: 20,
                height: 20,
                fontSize: 12,
                mr: 1,
              }}
            >
              {/* First letter only */}
              {details.submittedByAccountId[0]}
            </Avatar>
            <Typography
              fontWeight={500}
              color={colors.NEUTRAL400}
              fontSize={16}
              className="ellipsis"
              maxWidth={maxWidth430 ? "100%" : isAdmin ? "80px" : "180px"}
            >
              {details.submittedByAccountId}
            </Typography>
          </Stack>
        </Stack>

        {updating ? (
          <CustomCircularProgress sx={{ py: 1, pb: 1.7 }} size={30} />
        ) : (
          <>
            {isAdmin ? (
              <Stack direction="row" justifyContent="space-evenly" width="64%">
                <CustomButton
                  color="beige"
                  bodySize="medium"
                  onClick={switchActivation}
                  onMouseOver={activeMouseOverHandler}
                  onMouseOut={activeMouseOutHandler}
                  sx={{
                    mt: maxWidth430 ? 2 : 0,
                    mr: 1,
                    px: 2,
                    ...(activeLabel === "De-Activate" && details.isActive
                      ? { px: 1 }
                      : {}),
                    ...(details.isActive
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
                  {details.isActive ? activeLabel : "Activate"}
                </CustomButton>
                <CustomButton
                  color="red"
                  bodySize="medium"
                  onClick={switchFlag}
                  onMouseOver={flaggedMouseOverHandler}
                  onMouseOut={flaggedMouseOutHandler}
                  sx={{
                    mt: maxWidth430 ? 2 : 0,
                    px: 2,
                    pb: 0.4,
                    ...(flaggedLabel === "Un-Flag" && details.isFlagged
                      ? { px: 2 }
                      : {}),
                    ...(details.isFlagged
                      ? {
                          backgroundColor:
                            colorSystem === "regular"
                              ? colors.ERROR_RED
                              : colors.PRIMARY,
                          color: colors.PEACH,
                          ":hover": {
                            ...(colorSystem !== "regular"
                              ? { backgroundColor: colors.NEUTRAL700 }
                              : {}),
                          },
                        }
                      : {}),
                  }}
                >
                  {details.isFlagged ? flaggedLabel : "Flag"}
                </CustomButton>
              </Stack>
            ) : (
              <Button
                variant="contained"
                color="warning"
                size="medium"
                disableRipple
                onClick={verifyHandler}
                sx={{ mt: maxWidth430 ? 2 : 0 }}
              >
                Verify
              </Button>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
