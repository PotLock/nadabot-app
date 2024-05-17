import { Stack } from "@mui/material";

import {
  ContentRichModal,
  ContentRichModalProps,
} from "@nadabot/common/ui/components/ContentRichModal";

export type GroupOverviewDialogProps = Pick<
  ContentRichModalProps,
  "open" | "onClose"
> & {};

export const GroupOverviewDialog: React.FC<GroupOverviewDialogProps> = ({
  ...props
}) => {
  return (
    <ContentRichModal {...props}>
      <Stack gap={2}></Stack>
    </ContentRichModal>
  );
};
