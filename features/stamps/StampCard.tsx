import CheckIcon from "@mui/icons-material/Check";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Box, Chip, Stack, SxProps, Theme, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { Routes } from "@nadabot/common/constants";
import { DIALOGS, useDialogs } from "@nadabot/common/contexts/dialogs";
import removeViewStampFromURLQuery from "@nadabot/common/lib/removeViewStampFromURLQuery";
import {
  daysSinceTimestamp,
  millisecondsToDays,
} from "@nadabot/common/lib/time";
import * as contract from "@nadabot/common/services/contracts/sybil.nadabot";
import {
  ProviderExternalWithIsHuman,
  ProviderStatus,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import { useProviders } from "@nadabot/common/store/useProviders";
import colors from "@nadabot/common/ui/colors";
import ButtonContainer from "@nadabot/common/ui/components/ButtonContainer";
import CustomAvatar from "@nadabot/common/ui/components/CustomAvatar";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import useSnackbars from "@nadabot/common/ui/utils/useSnackbars";
import useSpinner from "@nadabot/common/ui/utils/useSpinner";
import useProviderStatusChecker from "@nadabot/hooks/useProviderStatusChecker";

import { StampAdminSettings } from "./StampAdminSettings";

export type StampCardProps = {
  hidePoints?: boolean;
  sx?: SxProps<Theme>;
  colorSystem?: "regular" | "admin";
  providerInfo: ProviderExternalWithIsHuman;
  isPreview?: boolean;
  isStamp?: boolean;
  verifyButtonSx?: SxProps<Theme>;
  adminView?: boolean;
  selectable?: boolean;
  onSelectClick?: VoidFunction;
  selected?: boolean;
};

export const StampCard: React.FC<StampCardProps> = ({
  hidePoints,
  sx,
  providerInfo,
  isPreview,
  colorSystem = "regular",
  isStamp,
  verifyButtonSx,
  adminView,
  selectable = false,
  onSelectClick,
  selected = false,
}) => {
  const isSelectable = selectable && typeof onSelectClick === "function";
  const [isAdmin] = useState(adminView || false);
  const { updateProvider } = useProviders();
  const { maxWidth430 } = useBreakPoints();
  const { openDialog } = useDialogs();
  const { showSpinner, hideSpinner } = useSpinner();
  const [isFooterHidden, setIsFooterHidden] = useState(false);
  const [hasPendingUpdate, indicatePendingUpdate] = useState(false);
  const { showSnackbar } = useSnackbars();
  const router = useRouter();

  const [isProviderActive] = useState(
    providerInfo.status === ProviderStatus.Active,
  );

  const expirationPeriodDays: number | null = useMemo(
    () =>
      typeof providerInfo.stamp_validity_ms === "number"
        ? millisecondsToDays(providerInfo.stamp_validity_ms) -
          daysSinceTimestamp(providerInfo.submitted_at_ms)
        : null,

    [providerInfo.stamp_validity_ms, providerInfo.submitted_at_ms],
  );

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

    indicatePendingUpdate(true);

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

    indicatePendingUpdate(false);
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
  const openStampDialog = useCallback(() => {
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

  const authorCredentials = useMemo(
    () => (
      <Stack justifyContent="center">
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
    ),

    [isAdmin, maxWidth430, providerInfo.submitted_by],
  );

  const providerActions = useMemo(
    () =>
      isAdmin ? (
        <CustomButton
          color="peach"
          bodySize="medium"
          onClick={switchActivation}
          progress={hasPendingUpdate}
          sx={{
            mt: maxWidth430 ? 2 : 0,
            px: 2,

            ...(isProviderActive
              ? {
                  backgroundColor:
                    colorSystem === "regular" ? colors.PEACH : colors.PRIMARY,

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
      ) : (
        <CustomButton
          color="peach"
          bodySize="medium"
          onClick={
            providerInfo.is_user_a_human ? verifyHandler : getCheckHandler
          }
          sx={{ mt: maxWidth430 ? 2 : 0, ...verifyButtonSx }}
        >
          {providerInfo.is_user_a_human ? "Verify" : "Get Check"}
        </CustomButton>
      ),

    [
      colorSystem,
      getCheckHandler,
      hasPendingUpdate,
      isAdmin,
      isProviderActive,
      maxWidth430,
      providerInfo.is_user_a_human,
      switchActivation,
      verifyButtonSx,
      verifyHandler,
    ],
  );

  return (
    <Stack
      gap={2}
      minWidth={maxWidth430 ? "100%" : 352}
      maxWidth={maxWidth430 ? "100%" : 352}
      width="100%"
      sx={{
        border: `1px solid ${colors.LIGHTGRAY}`,
        borderRadius: 2,
        background: isStamp ? colors.GRAY100 : "transparent",
        ...sx,
      }}
    >
      <Stack px={2} pt={2} minHeight={isAdmin ? 200 : 280}>
        <Stack direction="row" justifyContent="space-between">
          {/* Circle */}
          <ButtonContainer onClick={openStampDialog}>
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
        <ButtonContainer onClick={openStampDialog}>
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
        <ButtonContainer onClick={openStampDialog}>
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
        <ButtonContainer onClick={openStampDialog}>
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
      </Stack>

      {isAdmin && (
        <StampAdminSettings
          embedded
          disabled={hasPendingUpdate}
          indicateUnsavedChanges={setIsFooterHidden}
          {...{ providerInfo }}
        />
      )}

      {/* Footer */}
      <Stack
        display={isFooterHidden ? "none" : "flex"}
        direction={maxWidth430 ? "column" : "row"}
        justifyContent="space-between"
        p={2}
        sx={{
          borderTop: `1px solid ${colors.LIGHTGRAY}`,
          // borderRadius: 2,
        }}
      >
        {authorCredentials}

        <Stack direction="row" alignItems="center" gap={1}>
          {isStamp ? (
            <>
              {expirationPeriodDays !== null ? (
                <ErrorOutlineIcon
                  sx={{ fontSize: 19, color: colors.NEUTRAL500, mt: -0.3 }}
                />
              ) : (
                <CheckIcon
                  sx={{ fontSize: 19, color: colors.BLUE, mt: -0.3 }}
                />
              )}

              <Typography
                color={
                  expirationPeriodDays !== null
                    ? colors.NEUTRAL500
                    : colors.BLUE
                }
                fontSize={14}
                fontWeight={600}
              >
                {expirationPeriodDays !== null
                  ? `Expires in ${expirationPeriodDays} days`
                  : "Verified"}
              </Typography>
            </>
          ) : (
            <>
              {isSelectable ? (
                <CustomButton
                  color="blue"
                  onClick={onSelectClick}
                  sx={{
                    borderRadius: "100%",
                    p: 0,
                    width: 40,
                    height: 40,
                    background: selected ? undefined : colors.WHITE,
                  }}
                >
                  {selected && (
                    <CheckSharpIcon sx={{ width: 18, height: 18 }} />
                  )}
                </CustomButton>
              ) : (
                providerActions
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
