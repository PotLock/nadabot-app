import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import { AvatarGroup, Slider, Stack, Typography } from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";

import CustomCircularProgress from "@nadabot/components/ui/CustomCircularProgress";
import Tag from "@nadabot/components/ui/Tag";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import * as contract from "@nadabot/services/web3/contract-interface";
import { ProviderExternal } from "@nadabot/services/web3/interfaces/providers";
import colors from "@nadabot/theme/colors";

import CustomAvatar from "../../../ui/CustomAvatar";

type Props = {
  providerInfo?: ProviderExternal;
};

export default function Description({ providerInfo }: Props) {
  const { isAdmin } = useUser();
  const { maxWidth962, maxWidth600, maxWidth430 } = useBreakPoints();
  const [updating, setUpdating] = useState(false);
  const [points, setPoints] = useState(providerInfo?.default_weight);
  const [previousPoints, setPreviousPoints] = useState(
    providerInfo!.default_weight,
  );
  const debouncedPoints = useDebounce(points, 1200);

  const changePointsHandler = useCallback(async (newValue: number) => {
    setPoints(newValue);
  }, []);

  // Check if it's needed to update the Provider points
  useEffect(() => {
    if (debouncedPoints && providerInfo && debouncedPoints !== previousPoints) {
      // Update this Provider points
      (async () => {
        setUpdating(true);
        await contract.update_provider({
          provider_id: providerInfo.provider_id,
          default_weight: debouncedPoints,
        });
        setUpdating(false);
        setPreviousPoints(debouncedPoints);
      })();
    }
  }, [debouncedPoints, points, previousPoints, providerInfo]);

  // Users for Stamp
  const [verifiedUsers, setVerifiedUsers] = useState<string[]>();
  useEffect(() => {
    if (providerInfo?.provider_id) {
      (async () => {
        const usersForStamp = await contract.get_users_for_stamp({
          provider_id: providerInfo.provider_id,
        });
        setVerifiedUsers(usersForStamp);

        // TODO: Users for stamp
        console.log("USERS FOR STAMP:", usersForStamp);
      })();
    }
  }, [providerInfo?.provider_id]);

  return (
    <Stack
      mt={6}
      direction={maxWidth962 ? "column" : "row"}
      justifyContent="space-between"
    >
      {/* Left */}
      <Stack>
        <Typography fontSize={20} fontWeight={600}>
          Contract Description
        </Typography>
        <Typography textOverflow="ellipsis" mt={2}>
          {providerInfo?.description}
          {/* Lorem ipsum dolor sit amet, consectet adipiscing elit, sed do eiusmod
          tempor ncididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. */}
        </Typography>
        {/* Verifiers */}
        {verifiedUsers && verifiedUsers[0] && (
          <Stack direction="row" mt={2}>
            {/* TODO: buscar as imagens do NEAR Social DB */}
            <AvatarGroup>
              {verifiedUsers.slice(0, 3).map((userAccountId) => (
                <CustomAvatar key={userAccountId} accountId={userAccountId} />
              ))}
            </AvatarGroup>
            <Typography fontSize={12} ml={1}>
              <strong>{verifiedUsers[0]}</strong>
            </Typography>
            {/* Se tiver mais */}
            {verifiedUsers.length > 1 && (
              <Typography fontSize={12} ml={0.5}>
                and <strong>{verifiedUsers.length - 1} others</strong> Verified
              </Typography>
            )}
          </Stack>
        )}
        {/* Tags */}
        <Stack direction={maxWidth430 ? "column" : "row"} mt={2}>
          {providerInfo?.tags?.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              sx={{ mr: maxWidth430 ? 0 : 2, mt: maxWidth430 ? 1 : 0 }}
            />
          ))}
        </Stack>
      </Stack>
      {/* Right */}
      {isAdmin && (
        <Stack
          p={2}
          ml={maxWidth962 ? 0 : 4}
          mt={maxWidth962 ? 2 : 0}
          gap="20px"
          borderRadius="6px"
          border={`1px solid ${colors.NEUTRAL200}`}
          minWidth={maxWidth600 ? "100%" : "344px"}
          height="fit-content"
        >
          <Stack direction="row" alignItems="center">
            <SettingsIcon sx={{ width: 20, height: 20 }} />
            <Typography fontSize={20} fontWeight={700} ml={1}>
              Settings
            </Typography>
          </Stack>
          {/* Edit Points and Slider */}
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row">
              <Typography fontWeight={600} mr={1}>
                Edit Points
              </Typography>
              <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300, width: 16 }} />
            </Stack>
            <Stack borderRadius="4px" border={`1px solid ${colors.NEUTRAL100}`}>
              <Typography fontWeight={600} color={colors.NEUTRAL500} px={1}>
                {/* {debouncedPoints} pts */}
                {providerInfo?.default_weight} pts
              </Typography>
            </Stack>
          </Stack>
          {/* Slider */}
          {updating ? (
            <CustomCircularProgress sx={{ py: 1 }} size={30} />
          ) : (
            <Slider
              sx={{ mt: -2 }}
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
  );
}
