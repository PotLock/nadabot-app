import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import * as contract from "@nadabot/common/services/contracts/sybil.nadabot";
import CustomButton from "@nadabot/common/ui/CustomButton";
import Input from "@nadabot/common/ui/Input";
import colors from "@nadabot/common/ui/theme/colors";
import { ListDashboardIcon } from "@nadabot/common/ui/theme/icons";
import { ShadowContainer } from "@nadabot/components/containers/ShadowContainer";
import { useConfig } from "@nadabot/hooks/store/useConfig";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useSpinner from "@nadabot/hooks/useSpinner";

export default function AdminDashboardSection() {
  const { maxWidth962, maxWidth700 } = useBreakPoints();
  const { config, updateHumanThreshold } = useConfig();
  const adjustedHumanThreshold = config.default_human_threshold;

  const [humanThreshold, setHumanThreshold] = useState(adjustedHumanThreshold);
  const { showSpinner, hideSpinner } = useSpinner();

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
    <Stack>
      <Typography variant="h4" fontWeight={700}>
        Admin Dashboard
      </Typography>
      <ShadowContainer sx={{ mt: 1 }}>
        <Stack direction="row" alignItems="center">
          <ListDashboardIcon />
          <Typography fontWeight={700} fontSize={24} mx={1}>
            Human Threshold
          </Typography>
          <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300 }} />
        </Stack>

        <Typography color={colors.NEUTRAL400} fontSize={16}>
          Set a human threshold for the users, Current Human threshold is set to{" "}
          <b>{adjustedHumanThreshold} Points</b>
        </Typography>

        <Stack
          direction={maxWidth700 ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          mt={4}
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
            onClick={setThresholdHandler}
            fontSize="small"
            bodySize="medium"
            color="beige"
            disabled={adjustedHumanThreshold === humanThreshold}
            sx={{ mt: maxWidth700 ? 2 : 0 }}
          >
            Set Threshold
          </CustomButton>
        </Stack>
      </ShadowContainer>
    </Stack>
  );
}
