import AddIcon from "@mui/icons-material/Add";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import { DIALOGS, useDialogs } from "@nadabot/common/contexts/dialogs";
import * as contract from "@nadabot/common/services/contracts/sybil.nadabot";
import colors from "@nadabot/common/ui/colors";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import Input from "@nadabot/common/ui/components/Input";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import { ListDashboardIcon } from "@nadabot/common/ui/icons";
import useSpinner from "@nadabot/common/ui/utils/globalSpinner";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { useConfig } from "@nadabot/modules/core/store/useConfig";

export default function AdminDashboardSection() {
  const { maxWidth962, maxWidth700 } = useBreakPoints();
  const { showSpinner, hideSpinner } = useSpinner();
  const { openDialog } = useDialogs();
  const { config, updateHumanThreshold } = useConfig();
  const adjustedHumanThreshold = config.default_human_threshold;
  const [humanThreshold, setHumanThreshold] = useState(adjustedHumanThreshold);

  const onCreateGroupClick = useCallback(
    () => openDialog({ dialog: DIALOGS.GroupDialog }),
    [openDialog],
  );

  const setThresholdHandler = useCallback(async () => {
    if (adjustedHumanThreshold !== humanThreshold) {
      showSpinner();
      const updatedHumanThreshold = humanThreshold;
      await contract.admin_set_default_human_threshold(updatedHumanThreshold);
      updateHumanThreshold(updatedHumanThreshold);
      hideSpinner();
    }
  }, [
    humanThreshold,
    updateHumanThreshold,
    showSpinner,
    hideSpinner,
    adjustedHumanThreshold,
  ]);

  return (
    <Stack gap={1}>
      <Typography variant="h4" fontWeight={700}>
        Admin Dashboard
      </Typography>

      <Stack gap={3} direction={maxWidth962 ? "column" : "row"}>
        <ShadowContainer
          sx={{
            px: 4,
            py: 3,
            gap: 3,
            justifyContent: "space-between",
            height: "100%",
          }}
          width={maxWidth962 ? "100%" : "60%"}
        >
          <Stack gap={1}>
            <Stack gap={1.5} direction="row" alignItems="center">
              <ListDashboardIcon />

              <Typography fontWeight={700} fontSize={24}>
                Human Threshold
              </Typography>

              <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300 }} />
            </Stack>

            <Typography color={colors.NEUTRAL400} fontSize={16}>
              Set a human threshold for the users. Current human threshold is
              set to <b>{adjustedHumanThreshold} Points</b>
            </Typography>
          </Stack>

          <Stack
            direction={maxWidth700 ? "column" : "row"}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Input
              placeholder="Enter a numeric value for the human threshold"
              type="number"
              defaultValue={humanThreshold}
              onChange={(event) =>
                setHumanThreshold(parseInt(event.target.value))
              }
              sx={{ width: maxWidth700 ? "100%" : maxWidth962 ? "70%" : "80%" }}
            />

            <CustomButton
              bodySize="medium"
              color="peach"
              fontSize="small"
              onClick={setThresholdHandler}
              disabled={adjustedHumanThreshold === humanThreshold}
              sx={{ px: 2 }}
            >
              Update Threshold
            </CustomButton>
          </Stack>
        </ShadowContainer>

        <ShadowContainer
          sx={{
            px: 4,
            py: 3,
            gap: 3,
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
          width={maxWidth962 ? "100%" : "40%"}
        >
          <Stack gap={1} width="100%">
            <Stack gap={1.5} direction="row" alignItems="center">
              <GroupWorkOutlinedIcon sx={{ fontWeight: 600 }} />

              <Typography fontWeight={700} fontSize={24}>
                Create Groups
              </Typography>

              <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300 }} />
            </Stack>

            <Typography color={colors.NEUTRAL400} fontSize={16}>
              Create a group of checks with a rule attached to it.
            </Typography>
          </Stack>

          <Stack
            direction={maxWidth700 ? "column" : "row"}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <CustomButton
              bodySize="medium"
              color="black"
              fontSize="small"
              onClick={onCreateGroupClick}
              sx={{ pl: 2, pr: 3 }}
            >
              <AddIcon fontSize="small" />
              <span>Create Group</span>
            </CustomButton>
          </Stack>
        </ShadowContainer>
      </Stack>
    </Stack>
  );
}
