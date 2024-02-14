import CheckIcon from "@mui/icons-material/Check";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import CustomAvatar from "@nadabot/components/ui/CustomAvatar";
import CustomButton from "@nadabot/components/ui/CustomButton";
import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import Tag from "@nadabot/components/ui/Tag";
import { NETWORK } from "@nadabot/constants";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import { useStamps } from "@nadabot/hooks/store/useStamps";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useIsHumanCacheCheck from "@nadabot/hooks/useIsHumanCacheCheck";
import useSnackbars from "@nadabot/hooks/useSnackbars";
import useSpinner from "@nadabot/hooks/useSpinner";
import useWindowTabFocus from "@nadabot/hooks/useWindowTabFocus";
import { Routes } from "@nadabot/routes";
import * as contract from "@nadabot/services/contracts/sybil.nadabot";
import {
  ProviderExternal,
  ProviderStatus,
} from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";
import truncate from "@nadabot/utils/truncate";

type Props = {
  providerInfo?: ProviderExternal;
};

export default function Header({ providerInfo }: Props) {
  const [updating, setUpdating] = useState(false);
  const { isAdmin } = useUser();
  const { updateProvider } = useProviders();
  const { maxWidth1280, maxWidth805, maxWidth700, maxWidth430 } =
    useBreakPoints();
  const { showSnackbar } = useSnackbars();
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();

  // Check if user has a stamp with this provider [verified]
  const { stamps } = useStamps();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let hasStamp = false;
    stamps.forEach((stamp) => {
      if (
        !hasStamp &&
        stamp.provider.provider_id === providerInfo?.provider_id
      ) {
        hasStamp = true;
      }
    });
    setIsVerified(hasStamp);
  }, [stamps, providerInfo]);

  const imageURL = providerInfo?.icon_url
    ? providerInfo.icon_url.replace(
        "https://gateway.pinata.cloud/ipfs/",
        "https://ipfs.io/ipfs/",
      )
    : null;

  const [isProviderActive] = useState(
    providerInfo?.status === ProviderStatus.Active,
  );

  // Switch Activation
  const switchActivation = useCallback(async () => {
    setUpdating(true);
    if (!isProviderActive) {
      await contract.admin_activate_provider({
        provider_id: providerInfo!.provider_id,
        default_weight: providerInfo!.default_weight || 0,
      });
      updateProvider({
        provider_id: providerInfo!.provider_id,
        default_weight: providerInfo!.default_weight || 0,
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
        provider_id: providerInfo!.provider_id,
      });
      updateProvider({
        provider_id: providerInfo!.provider_id,
        status: ProviderStatus.Deactivated,
      });
    }
    setUpdating(false);
  }, [providerInfo, updateProvider, showSnackbar, router, isProviderActive]);

  // Active / De-Activate
  const [activeLabel, setActiveLabel] = useState("Active");
  const activeMouseOverHandler = useCallback(() => {
    setActiveLabel("De-Activate");
  }, []);

  const activeMouseOutHandler = useCallback(() => {
    setActiveLabel("Active");
  }, []);

  // Is Human Check
  const {
    isHuman,
    ready: isHumanVerificationReady,
    verify,
  } = useIsHumanCacheCheck(
    providerInfo?.provider_id,
    providerInfo?.contract_id,
    providerInfo?.method_name,
    providerInfo?.account_id_arg_name,
  );

  // Verify if it's human every time the window tab is focused
  useWindowTabFocus(async () => {
    await verify();
  });

  const verifyHandler = useCallback(async () => {
    showSpinner();
    // Check if it isHuman (and cache result)
    const isHumanVerify = await verify();

    // If so, then, call add_stamp method
    if (isHumanVerify && providerInfo?.provider_id) {
      try {
        await contract.add_stamp(providerInfo.provider_id);
      } catch (error) {
        console.error(error);
      }

      hideSpinner();
    }
  }, [providerInfo?.provider_id, verify, showSpinner, hideSpinner]);

  const getCheckHandler = useCallback(() => {
    // Open up the external URL
    window.open(providerInfo?.external_url, "_blank");
  }, [providerInfo?.external_url]);

  const openContractAddress = useCallback(() => {
    const explorerURL =
      NETWORK === "mainnet"
        ? `https://nearblocks.io/address/${providerInfo?.contract_id}`
        : `https://testnet.nearblocks.io/address/${providerInfo?.contract_id}`;

    window.open(explorerURL, "_blank");
  }, [providerInfo?.contract_id]);

  return (
    <Stack
      direction={maxWidth1280 ? "column" : "row"}
      justifyContent="space-between"
      alignItems={maxWidth1280 ? "center" : "flex-start"}
    >
      {/* Left */}
      <Stack
        direction={maxWidth805 ? "column" : "row"}
        alignItems={maxWidth805 ? "center" : "flex-start"}
      >
        {/* Circle */}
        <Box
          bgcolor={"rgba(0, 0,0,.2)"}
          width={84}
          height={84}
          borderRadius={999}
          sx={{
            mr: maxWidth805 ? 0 : 4,
            ...(providerInfo?.icon_url
              ? {
                  backgroundImage: `url(${imageURL})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {}),
          }}
        />

        <Stack direction="column">
          <Typography
            fontWeight={600}
            fontSize={maxWidth805 ? 26 : 32}
            textAlign={maxWidth805 ? "center" : "left"}
            mb={maxWidth805 ? 2 : 0}
          >
            {truncate(providerInfo?.name || "", 28)}
          </Typography>
          <Stack direction={maxWidth700 ? "column" : "row"}>
            <Stack
              mr={maxWidth700 ? 0 : 4}
              mb={maxWidth700 ? 2 : 0}
              alignItems={maxWidth700 ? "center" : "flex-start"}
            >
              <Typography
                color={colors.NEUTRAL700}
                fontSize={12}
                fontWeight={700}
              >
                CONTRACT NAME
              </Typography>
              <Tag
                label={truncate(providerInfo?.contract_id || "", 14)}
                size="small"
                removeBg
                asButton
                onClick={openContractAddress}
                sx={{ px: 1, py: 0 }}
              />
            </Stack>
            <Stack
              mr={maxWidth700 ? 0 : 4}
              mb={maxWidth700 ? 2 : 0}
              alignItems={maxWidth700 ? "center" : "flex-start"}
            >
              <Typography
                color={colors.NEUTRAL700}
                fontSize={12}
                fontWeight={700}
              >
                METHOD
              </Typography>
              <Tag
                label={`${providerInfo?.method_name}()`}
                size="small"
                removeBg
                sx={{ px: 1, py: 0 }}
              />
            </Stack>
            <Stack alignItems={maxWidth700 ? "center" : "flex-start"}>
              <Typography
                color={colors.NEUTRAL700}
                fontSize={12}
                fontWeight={700}
              >
                SUBMITTED BY
              </Typography>
              <Tag
                label={truncate(providerInfo?.submitted_by || "", 14)}
                size="small"
                removeBg
                sx={{ px: 1, py: 0 }}
                leftContent={
                  <CustomAvatar
                    accountId={providerInfo?.submitted_by}
                    size={16}
                    fontSize={12}
                    sx={{ mr: 1 }}
                  />
                }
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      {/* Right */}
      <Stack
        direction={maxWidth700 ? "column" : "row"}
        width={maxWidth700 ? "100%" : "fit-content"}
        alignItems="center"
        mt={maxWidth1280 ? 4 : 0}
      >
        <Stack alignItems="center" direction="row" mb={maxWidth700 ? 2 : 0}>
          <Stack alignItems="center" mr={maxWidth700 ? 0 : 2} width="108px">
            <Typography fontWeight={700} fontSize={36} textAlign="center">
              {providerInfo?.default_weight}
            </Typography>
            <Typography fontSize={17} fontWeight={400} textAlign="center">
              Total Points
            </Typography>
          </Stack>
          <Stack alignItems="center" mr={maxWidth700 ? 0 : 2} width="142px">
            <Typography fontWeight={700} fontSize={36} textAlign="center">
              {providerInfo?.stamp_count}
            </Typography>
            <Typography fontSize={17} fontWeight={400} textAlign="center">
              People Verified
            </Typography>
          </Stack>
        </Stack>
        {updating ? (
          <CustomCircularProgress sx={{ py: 1, pb: 1.7 }} size={30} />
        ) : (
          <>
            {isAdmin && router.route === Routes.ADMIN_HOME ? (
              <Stack
                direction="row"
                justifyContent="space-evenly"
                width={maxWidth700 ? "100%" : "64%"}
              >
                <CustomButton
                  color="beige"
                  bodySize={maxWidth430 ? "medium" : "large"}
                  fontSize={maxWidth430 ? "small" : "medium"}
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
                          backgroundColor: colors.PRIMARY,
                          color: colors.NEUTRAL50,
                          ":hover": {
                            backgroundColor: colors.NEUTRAL700,
                          },
                        }
                      : {}),
                  }}
                >
                  {isProviderActive ? activeLabel : "Activate"}
                </CustomButton>
              </Stack>
            ) : (
              <>
                {isVerified ? (
                  <Stack direction="row" alignItems="center" ml={1.5}>
                    <CheckIcon
                      sx={{
                        fontSize: 32,
                        color: colors.BLUE,
                        mr: 1,
                        mt: -0.4,
                      }}
                    />
                    <Typography
                      color={colors.BLUE}
                      fontSize={28}
                      fontWeight={600}
                    >
                      Verified
                    </Typography>
                  </Stack>
                ) : (
                  <>
                    {!isHumanVerificationReady ? (
                      <CircularProgress
                        size={22}
                        sx={{ color: colors.BLUE, mt: 2, mb: 1.7, mr: 4 }}
                      />
                    ) : (
                      <CustomButton
                        color="beige"
                        bodySize={maxWidth430 ? "medium" : "large"}
                        fontSize={maxWidth430 ? "small" : "medium"}
                        onClick={isHuman ? verifyHandler : getCheckHandler}
                        sx={{
                          mt: maxWidth430 ? 2 : 0,
                          mr: 2,
                          px: 2,
                        }}
                      >
                        {isHuman ? "Verify" : "Get Check"}
                      </CustomButton>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
