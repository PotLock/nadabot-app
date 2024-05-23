import {
  Avatar,
  AvatarGroup,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DIALOGS, useDialogs } from "@nadabot/common/contexts/dialogs";
import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/common/ui/colors";
import Tag from "@nadabot/common/ui/components/Tag";

import { GROUP_RULE_TYPE_PARAMS } from "./constants";
import { extractRuleParams } from "./lib";

type ShowcasedProviders = [
  ProviderExternal?,
  ProviderExternal?,
  ProviderExternal?,
];

const iconSizeToStyle = (size: number) => ({
  width: size,
  height: size,
  backgroundColor: "#fff",
});

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

  const [showcasedProviderData, setShowcasedProviderData] =
    useState<ShowcasedProviders>([]);

  const providersPreview = useMemo(() => {
    const [first, second, third] = showcasedProviderData;

    return (
      <AvatarGroup spacing="small" sx={{ alignItems: "center" }}>
        {first && (
          <Avatar
            src={first.icon_url}
            title={first.provider_name}
            sx={iconSizeToStyle(46)}
          >
            {first.provider_name}
          </Avatar>
        )}

        {second && (
          <Avatar
            src={second.icon_url}
            title={second.provider_name}
            sx={iconSizeToStyle(38)}
          >
            {second.provider_name}
          </Avatar>
        )}

        {third && (
          <Avatar
            src={third.icon_url}
            title={third.provider_name}
            sx={iconSizeToStyle(30)}
          >
            {third.provider_name}
          </Avatar>
        )}
      </AvatarGroup>
    );
  }, [showcasedProviderData]);

  const onClick = useCallback(
    () => openDialog({ dialog: DIALOGS.GroupDialog, props: { groupId: id } }),
    [id, openDialog],
  );

  useEffect(() => {
    Promise.all(
      providerIds
        .slice(0, 2)
        .map((provider_id) => sybilContract.get_provider({ provider_id })),
    ).then(([first, second, third]) =>
      setShowcasedProviderData([first, second, third]),
    );
  }, [providerIds]);

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
      sx={{ ...sx, cursor: "pointer" }}
    >
      <Stack gap={0.5} direction="row" alignItems="center" width={158}>
        {providersPreview}

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
