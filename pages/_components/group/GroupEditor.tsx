import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";

export type GroupEditorProps = {
  data: GroupExternal;
};

export const GroupEditor: React.FC<GroupEditorProps> = ({ data }) => {
  const isNew = data.id === 0;

  console.table({ isNew });
  console.table(data);

  return <></>;
};
