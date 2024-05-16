import { AvatarGroup, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import * as contract from "@nadabot/common/services/contracts/sybil.nadabot";
import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import CustomAvatar from "@nadabot/common/ui/components/CustomAvatar";
import Tag from "@nadabot/common/ui/components/Tag";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import { StampAdminSettings } from "@nadabot/pages/_components/stamp/StampAdminSettings";
import { Routes } from "@nadabot/routes";

type Props = {
  providerInfo?: ProviderExternal;
};

export default function Description({ providerInfo }: Props) {
  const { isAdmin } = useUser();
  const router = useRouter();
  const { maxWidth962, maxWidth430 } = useBreakPoints();

  // Users for Stamp
  const [verifiedUsers, setVerifiedUsers] = useState<string[]>();

  useEffect(() => {
    if (providerInfo?.id) {
      contract
        .get_users_for_stamp({ provider_id: providerInfo.id })
        .then(setVerifiedUsers);
    }
  }, [providerInfo?.id]);

  return (
    <Stack
      mt={6}
      direction={maxWidth962 ? "column" : "row"}
      justifyContent="space-between"
      gap={2}
    >
      {/* Left */}
      <Stack>
        <Typography fontSize={20} fontWeight={600}>
          Contract Description
        </Typography>

        <Typography textOverflow="ellipsis" mt={2}>
          {providerInfo?.description}
        </Typography>

        {/* Verifiers */}
        {verifiedUsers && verifiedUsers[0] && (
          <Stack direction="row" mt={2}>
            <AvatarGroup>
              {verifiedUsers.slice(0, 3).map((userAccountId) => (
                <CustomAvatar key={userAccountId} accountId={userAccountId} />
              ))}
            </AvatarGroup>

            <Typography fontSize={12} ml={1}>
              <strong>{verifiedUsers[0]}</strong>
            </Typography>

            {/* If there are more users... */}
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
      {isAdmin &&
        router.route === Routes.ADMIN_HOME &&
        providerInfo !== undefined && (
          <StampAdminSettings
            embedded
            sx={{ width: maxWidth962 ? "100%" : 352 }}
            {...{ providerInfo }}
          />
        )}
    </Stack>
  );
}
