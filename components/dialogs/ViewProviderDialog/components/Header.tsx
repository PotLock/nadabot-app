import { useCallback, useState } from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import CustomButton from "@nadabot/components/ui/CustomButton";
import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import Tag from "@nadabot/components/ui/Tag";
import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";
import colors from "@nadabot/theme/colors";
import { useUser } from "@nadabot/hooks/store/useUser";
import { useProviders } from "@nadabot/hooks/store/useProviders";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import * as contract from "@nadabot/services/web3/contract-interface";
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

  const imageURL = providerInfo?.icon_url
    ? providerInfo.icon_url.replace(
        "https://gateway.pinata.cloud/ipfs/",
        "https://ipfs.io/ipfs/"
      )
    : null;

  // Switch Activation
  const switchActivation = useCallback(async () => {
    setUpdating(true);
    if (!providerInfo!.is_active) {
      await contract.admin_activate_provider({
        provider_id: providerInfo!.provider_id,
        default_weight: providerInfo!.default_weight || 0,
      });
      updateProvider({
        provider_id: providerInfo!.provider_id,
        default_weight: providerInfo!.default_weight || 0,
        is_active: true,
      });
    } else {
      await contract.admin_deactivate_provider({
        provider_id: providerInfo!.provider_id,
      });
      updateProvider({
        provider_id: providerInfo!.provider_id,
        is_active: false,
      });
    }
    setUpdating(false);
  }, [providerInfo, updateProvider]);

  // Switch Flag
  const switchFlag = useCallback(async () => {
    setUpdating(true);
    if (!providerInfo!.is_flagged) {
      await contract.admin_flag_provider({
        provider_id: providerInfo!.provider_id,
      });
      updateProvider({
        provider_id: providerInfo!.provider_id,
        is_flagged: true,
      });
    } else {
      await contract.admin_unflag_provider({
        provider_id: providerInfo!.provider_id,
      });
      updateProvider({
        provider_id: providerInfo!.provider_id,
        is_flagged: false,
      });
    }
    setUpdating(false);
  }, [providerInfo, updateProvider]);

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

  const verifyHandler = useCallback(() => {
    // Handle here
  }, []);

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
                  <Avatar
                    sx={{
                      background: colors.PRIMARY,
                      width: 16,
                      height: 16,
                      fontSize: 12,
                      mr: 1,
                    }}
                  >
                    {/* First letter only */}
                    {providerInfo?.submitted_by[0]}
                  </Avatar>
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
            {/* TODO: Where to get this information? "People Verified" */}
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
            {isAdmin ? (
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
                    mr: 2,
                    px: 2,
                    ...(activeLabel === "De-Activate" && providerInfo?.is_active
                      ? { px: 1 }
                      : {}),
                    ...(providerInfo?.is_active
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
                  {providerInfo?.is_active ? activeLabel : "Activate"}
                </CustomButton>
                <CustomButton
                  color="red"
                  bodySize={maxWidth430 ? "medium" : "large"}
                  fontSize={maxWidth430 ? "small" : "medium"}
                  onClick={switchFlag}
                  onMouseOver={flaggedMouseOverHandler}
                  onMouseOut={flaggedMouseOutHandler}
                  sx={{
                    mt: maxWidth430 ? 2 : 0,
                    px: 2,
                    pb: 0.4,
                    ...(flaggedLabel === "Un-Flag" && providerInfo?.is_flagged
                      ? { px: 2 }
                      : {}),
                    ...(providerInfo?.is_flagged
                      ? {
                          // backgroundColor: colors.PRIMARY,
                          color: colors.PEACH,
                          ":hover": {
                            backgroundColor: colors.NEUTRAL700,
                          },
                        }
                      : {}),
                  }}
                >
                  {providerInfo?.is_flagged ? flaggedLabel : "Flag"}
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
