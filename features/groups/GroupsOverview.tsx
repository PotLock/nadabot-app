import { useEffect, useState } from "react";

import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";

import { GroupListItem } from "./GroupListItem";

export type GroupsOverviewProps = {};

export const GroupsOverview: React.FC<GroupsOverviewProps> = () => {
  const [availableGroups, setAvailableGroups] = useState<GroupExternal[]>([]);

  useEffect(() => {
    sybilContract.get_groups().then(setAvailableGroups).catch(console.error);
  }, []);

  return (
    <ShadowContainer sx={{ p: 4, gap: 2 }}>
      {availableGroups.map((group) => (
        <GroupListItem data={group} key={group.id} />
      ))}
    </ShadowContainer>
  );
};
