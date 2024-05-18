import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

export type GroupOverviewProps = {
  data: GroupExternal;
};

export const GroupOverview: React.FC<GroupOverviewProps> = ({ data }) => {
  console.table(data);

  return <></>;
};
