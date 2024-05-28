import { Stack, StackProps, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";

import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import colors from "@nadabot/common/ui/colors";
import Tag from "@nadabot/common/ui/components/Tag";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { DIALOGS, useDialogs } from "@nadabot/modules/core/contexts/dialogs";

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
  const { maxWidth1200 } = useBreakPoints();
  const { ruleType, ruleThreshold } = extractRuleParams(rule);

  const {
    title: ruleTypeTag,
    thresholdToDescription,
    color: ruleTypeColor,
  } = GROUP_RULE_TYPE_PARAMS[ruleType];

  const description = useMemo(
    () => thresholdToDescription(ruleThreshold ?? 0),
    [ruleThreshold, thresholdToDescription],
  );

  const onClick = useCallback(
    () => openDialog({ dialog: DIALOGS.GroupDialog, props: { groupId: id } }),
    [id, openDialog],
  );

  return (
    <Stack
      gap={3}
      direction={maxWidth1200 ? "column" : "row"}
      alignItems="center"
      justifyContent="space-between"
      border={`1px solid ${colors.NEUTRAL200}`}
      borderRadius={1.5}
      boxShadow={`0px 2px 2px 0px ${colors.NEUTRAL200}`}
      px={3}
      py={1.6}
      onClick={customClickHandler ?? onClick}
      sx={{ ...sx, cursor: "pointer" }}
    >
      <Stack
        gap={2}
        direction="row"
        alignItems="center"
        width={maxWidth1200 ? "100%" : "auto"}
      >
        <GroupPreview {...{ providerIds }} />

        <Stack
          direction="row"
          justifyContent={maxWidth1200 ? "start" : "center"}
          width={300}
        >
          <Typography fontSize={20} fontWeight={600} noWrap title={name}>
            {name}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        gap={2}
        direction="row"
        alignItems="center"
        width={maxWidth1200 ? "100%" : "auto"}
      >
        <Stack
          direction="row"
          justifyContent={maxWidth1200 ? "start" : "center"}
          width={maxWidth1200 ? 158 : 140}
        >
          <Tag
            color="#fff"
            bgColor={ruleTypeColor}
            fontWeight={600}
            label={ruleTypeTag.toUpperCase()}
          />
        </Stack>

        <Typography
          fontSize={16}
          fontWeight={400}
          pl={maxWidth1200 ? 0 : 3}
          width={maxWidth1200 ? "auto" : 340}
          noWrap
          title={description}
        >
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
};
