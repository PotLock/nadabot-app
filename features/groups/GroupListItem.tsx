import { Stack, StackProps, Typography } from "@mui/material";
import { useCallback } from "react";

import { DIALOGS, useDialogs } from "@nadabot/common/contexts/dialogs";
import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import colors from "@nadabot/common/ui/colors";
import Tag from "@nadabot/common/ui/components/Tag";

import { GROUP_RULE_TYPE_PARAMS } from "./constants";
import { GroupPreview } from "./GroupPreview";
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
  const { title: ruleTypeTag, color: ruleTypeColor } =
    GROUP_RULE_TYPE_PARAMS[ruleType];

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
      sx={{ ...sx, cursor: "pointer" }}
    >
      <GroupPreview {...{ providerIds }} />

      <Typography fontSize={20} fontWeight={600}>
        {name}
      </Typography>

      <Stack direction="row" justifyContent="center" width={200}>
        <Tag
          color="#fff"
          bgColor={ruleTypeColor}
          fontWeight={600}
          label={ruleTypeTag.toUpperCase()}
        />
      </Stack>
    </Stack>
  );
};
