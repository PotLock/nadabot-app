import { AvatarGroup, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import CustomAvatar from "@nadabot/common/ui/components/CustomAvatar";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import Tag from "@nadabot/common/ui/components/Tag";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { GroupListItem } from "@nadabot/modules/groups/components/GroupListItem";

export type StampInfoProps = {
  providerInfo?: ProviderExternal;
};

export const StampInfo: React.FC<StampInfoProps> = ({ providerInfo }) => {
  const { maxWidth430 } = useBreakPoints();
  const [relatedGroups, setRelatedGroups] = useState<GroupExternal[]>([]);

  // Users for Stamp
  const [verifiedUsers, setVerifiedUsers] = useState<string[]>();

  useEffect(() => {
    if (providerInfo?.id) {
      Promise.all([
        sybilContract
          .get_users_for_stamp({ provider_id: providerInfo.id })
          .then(setVerifiedUsers),

        sybilContract.get_groups().then((allGroups) =>
          setRelatedGroups(
            allGroups.reduce(
              (collectedGroups, group) => {
                if (group.providers.includes(providerInfo.id)) {
                  return [group, ...collectedGroups];
                } else return collectedGroups;
              },

              [] as typeof relatedGroups,
            ),
          ),
        ),
      ]);
    }
  }, [providerInfo?.id]);

  return (
    <Stack mt={6} gap={3} direction="column">
      <Stack gap={2}>
        <Typography fontSize={20} fontWeight={600}>
          Contract Description
        </Typography>

        <Typography textOverflow="ellipsis">
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

      {relatedGroups.length > 0 && (
        <Stack gap={2}>
          <Typography fontSize={20} fontWeight={600}>
            {`Included in ${relatedGroups.length} groups`}
          </Typography>

          <ShadowContainer sx={{ p: 2, gap: 2 }}>
            {relatedGroups.map((group) => (
              <GroupListItem data={group} key={group.id} />
            ))}
          </ShadowContainer>
        </Stack>
      )}
    </Stack>
  );
};
