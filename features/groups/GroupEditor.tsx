import { Select, Stack, Typography } from "@mui/material";

import colors from "@nadabot/common/ui/colors";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import Input from "@nadabot/common/ui/components/Input";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";

import { GroupFormParameters, useGroupForm } from "./groupForm";

export type GroupEditorProps = GroupFormParameters & {};

export const GroupEditor: React.FC<GroupEditorProps> = ({ data }) => {
  const { maxWidth805 } = useBreakPoints();
  const isNew = data.id === 0;

  const { handleChange, handleSubmit, isDisabled, isRulePrimitive, values } =
    useGroupForm({ data });

  return (
    <Stack gap={4} component="form" onSubmit={handleSubmit}>
      {isNew ? (
        <Stack gap={2} direction="row" justifyContent="space-between">
          <Stack>
            <Typography fontSize={40} fontWeight={700} lineHeight="48px">
              Create Group
            </Typography>

            <Typography fontSize={16} fontWeight={400} color={colors.SECONDARY}>
              Fill the following details to create a Rule
            </Typography>
          </Stack>

          <Stack>
            <CustomButton type="submit" disabled={isDisabled}>
              Create Group
            </CustomButton>
          </Stack>
        </Stack>
      ) : (
        <>
          <Stack gap={1}>
            <CustomButton color="red">Delete</CustomButton>
            <CustomButton>Edit</CustomButton>
          </Stack>
        </>
      )}

      <Stack
        gap={maxWidth805 ? 4 : 2}
        direction={maxWidth805 ? "column" : "row"}
      >
        <Input
          label="Group name"
          name="group_name"
          type="text"
          defaultValue={values.group_name}
          onChange={handleChange}
          sx={{ width: "100%" }}
        />

        <Select
          label="Rule type"
          name="rule_type"
          variant="outlined"
          sx={{ width: maxWidth805 ? "100%" : "45%" }}
        />
      </Stack>

      {!isRulePrimitive && (
        <Input
          label="Threshold points"
          name="rule_threshold"
          type="number"
          integersOnly
          min={1}
          defaultValue={values.rule_threshold ?? undefined}
          optional={values.rule_type === "Sum"}
          onChange={handleChange}
        />
      )}
    </Stack>
  );
};
