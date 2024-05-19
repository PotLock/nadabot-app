import { Select, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useMemo } from "react";

import { GroupExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/groups";
import colors from "@nadabot/common/ui/colors";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import Input from "@nadabot/common/ui/components/Input";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";

import { GroupSchema, groupDefaults, groupSchema } from "./model";

export type GroupEditorProps = {
  data: GroupExternal;
};

export const GroupEditor: React.FC<GroupEditorProps> = ({ data }) => {
  const { maxWidth805 } = useBreakPoints();
  const isNew = data.id === 0;

  const [ruleType, ruleThreshold] = useMemo(() => {
    const [unsafeType, threshold] =
      typeof data.rule === "string"
        ? [data.rule]
        : Object.entries(data.rule).at(0) ?? [groupDefaults.rule_type];

    const safeType: GroupSchema["rule_type"] =
      unsafeType === "Highest" ||
      unsafeType === "Lowest" ||
      unsafeType === "Sum" ||
      unsafeType === "DiminishingReturns" ||
      unsafeType === "IncreasingReturns"
        ? unsafeType
        : groupDefaults.rule_type;

    return [safeType, threshold];
  }, [data.rule]);

  const { dirty, handleChange, handleSubmit, isValid, values } =
    useFormik<GroupSchema>({
      validationSchema: groupSchema,

      initialValues: {
        group_name: data.name,
        rule_type: ruleType,
        rule_threshold: ruleThreshold,
        providers: data.providers,
      },

      onSubmit: (values) => {
        console.table({ isNew });
        console.table(values);
      },
    });

  const isDisabled = !isValid || !dirty;

  const isRulePrimitive =
    values.rule_type === "Highest" || values.rule_type === "Lowest";

  return (
    <Stack gap={4} component="form" onSubmit={handleSubmit}>
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
