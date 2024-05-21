import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { get_group } from "@nadabot/common/services/contracts/sybil.nadabot";
import {
  GroupExternal,
  GroupId,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import colors from "@nadabot/common/ui/colors";
import {
  ContentRichModal,
  ContentRichModalProps,
} from "@nadabot/common/ui/components/ContentRichModal";
import useSpinner from "@nadabot/common/ui/utils/useSpinner";

import { GroupInfo } from "./GroupInfo";
import { groupDefaults } from "./models";

export type GroupDialogProps = Pick<
  ContentRichModalProps,
  "open" | "onClose"
> & {
  groupId?: GroupId;
};

export const GroupDialog: React.FC<GroupDialogProps> = ({
  groupId,
  ...props
}) => {
  const isNew = typeof groupId !== "number";
  const { showSpinner, hideSpinner } = useSpinner();

  const [data, setData] = useState<GroupExternal | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (isNew) {
      setData({
        id: 0,
        name: "",
        providers: [],
        rule: groupDefaults.ruleType,
      });
    } else {
      get_group({ group_id: groupId })
        .then((response) => {
          if (response === undefined) {
            setError(new Error(`Group #${groupId} not found`));
          } else setData(response);
        })
        .catch(setError);
    }

    setLoading(false);
  }, [groupId, isNew]);

  useEffect(() => {
    if (error !== null) console.error(error);

    if (loading) {
      showSpinner();
    } else hideSpinner();
  }, [error, hideSpinner, loading, showSpinner]);

  return loading ? null : (
    <ContentRichModal {...props}>
      {error !== null && (
        <Stack width="100%" alignItems="center" justifyContent="center">
          <Typography color={colors.ERROR}>{error.message}</Typography>
        </Stack>
      )}

      {data !== null && <GroupInfo {...{ data }} />}
    </ContentRichModal>
  );
};
