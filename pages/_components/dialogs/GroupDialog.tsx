import { Stack } from "@mui/material";

import { GroupId } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import {
  ContentRichModal,
  ContentRichModalProps,
} from "@nadabot/common/ui/components/ContentRichModal";

export type GroupOverviewDialogProps = Pick<
  ContentRichModalProps,
  "open" | "onClose"
> & {
  id?: GroupId;
};

export const GroupDialog: React.FC<GroupOverviewDialogProps> = ({
  id,
  ...props
}) => {
  const isNew = typeof id !== "number";

  console.log("GroupDialog", { id, isNew });

  return (
    <ContentRichModal {...props}>
      <Stack gap={2}></Stack>
    </ContentRichModal>
  );
};
