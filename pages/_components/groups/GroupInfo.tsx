import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import { useUser } from "@nadabot/hooks/store/useUser";

import { GroupEditor } from "./GroupEditor";

export type GroupInfoProps = {
  data: GroupExternal;
};

export const GroupInfo: React.FC<GroupInfoProps> = ({ data }) => {
  const { isAdmin } = useUser();

  return isAdmin ? <GroupEditor {...{ data }} /> : <></>;
};
