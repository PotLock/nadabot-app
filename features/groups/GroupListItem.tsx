import {
  Avatar,
  AvatarGroup,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";

import { DIALOGS, useDialogs } from "@nadabot/common/contexts/dialogs";
import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/common/ui/colors";
import Tag from "@nadabot/common/ui/components/Tag";

import { GROUP_RULE_TYPE_PARAMS } from "./constants";
import { extractRuleParams } from "./lib";

export type GroupListItemProps = Pick<StackProps, "sx"> & {
  data: GroupExternal;
  onClick?: VoidFunction;
};

export const GroupListItem: React.FC<GroupListItemProps> = ({
  data: { id, name, providers: providerIds, rule },
  onClick: customClickHandler,
  sx,
}) => {
  const { openDialog } = useDialogs();
  const { ruleType } = extractRuleParams(rule);
  const { title: tag, color: tagBg } = GROUP_RULE_TYPE_PARAMS[ruleType];

  const [attachedProviderIconUrls, setAttachedProviderIconUrls] = useState<
    [
      ProviderExternal["icon_url"]?,
      ProviderExternal["icon_url"]?,
      ProviderExternal["icon_url"]?,
    ]
  >([]);

  const onClick = useCallback(
    () => openDialog({ dialog: DIALOGS.GroupDialog, props: { groupId: id } }),
    [id, openDialog],
  );

  return (
    <Stack
      gap={2}
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      border={`1px solid ${colors.NEUTRAL200}`}
      borderRadius={1.5}
      boxShadow={`0px 2px 2px 0px ${colors.NEUTRAL200}`}
      px={3}
      py={1.6}
      onClick={customClickHandler ?? onClick}
      {...{ sx }}
    >
      <Stack gap={0.5} direction="row" alignItems="center" width={158}>
        <AvatarGroup spacing="small" sx={{ alignItems: "center" }}>
          <Avatar
            sx={{ borderColor: "#fff", borderWidth: 2, width: 46, height: 46 }}
          />

          <Avatar
            sx={{ borderColor: "#fff", borderWidth: 2, width: 38, height: 38 }}
          />

          <Avatar
            sx={{ borderColor: "#fff", borderWidth: 2, width: 30, height: 30 }}
          />
        </AvatarGroup>

        {providerIds.length > 3 && (
          <Typography
            color={colors.NEUTRAL300}
            fontSize={16}
            fontWeight={400}
            whiteSpace="nowrap"
          >
            {`+${providerIds.length - 3} more`}
          </Typography>
        )}
      </Stack>

      <Typography fontSize={20} fontWeight={600}>
        {name}
      </Typography>

      <Stack direction="row" justifyContent="center" width={200}>
        <Tag
          color="#fff"
          bgColor={tagBg}
          fontWeight={600}
          label={tag.toUpperCase()}
        />
      </Stack>
    </Stack>
  );
};
