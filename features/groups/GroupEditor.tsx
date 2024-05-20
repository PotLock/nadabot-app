import { Stack, Typography } from "@mui/material";
import { useState } from "react";

import providerSorts from "@nadabot/common/lib/providerSorts";
import colors from "@nadabot/common/ui/colors";
import { AddFilterSearchInput } from "@nadabot/common/ui/components/AddFilterSearchInput";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import Input from "@nadabot/common/ui/components/Input";
import { Select } from "@nadabot/common/ui/components/Select";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";

import { GroupFormParameters, useGroupForm } from "./groupForm";
import { GroupSchema } from "./model";
import StampsOverview from "../stamps/StampsOverview";

export type GroupEditorProps = GroupFormParameters & {};

export const GroupEditor: React.FC<GroupEditorProps> = ({ data }) => {
  const isNew = data.id === 0;
  const { maxWidth805 } = useBreakPoints();
  const [providerSearchPattern, setProviderSearchPattern] = useState("");

  const { all: availableProviders } = useFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });

  const {
    errors,
    groupRuleTypeOptions,
    handleChange,
    handleSubmit,
    isDisabled,
    isRulePrimitive,
    values,
  } = useGroupForm({ data });

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
          errorMessage={errors.group_name}
          onChange={handleChange}
          sx={{ width: "100%" }}
        />

        <Select<GroupSchema["rule_type"]>
          label="Rule type"
          name="rule_type"
          options={groupRuleTypeOptions}
          value={values.rule_type}
          onChange={handleChange}
          width={maxWidth805 ? "100%" : "45%"}
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
          errorMessage={errors.rule_threshold}
          onChange={handleChange}
        />
      )}

      <Stack gap={0.5}>
        <Typography
          color={colors.NEUTRAL950}
          fontWeight={600}
          fontSize={16}
          noWrap
        >
          Select checks
        </Typography>

        <ShadowContainer>
          {availableProviders.length > 0 && (
            <AddFilterSearchInput
              onChange={setProviderSearchPattern}
              hideAddFilterButton
            />
          )}

          <StampsOverview
            providersList={availableProviders}
            searchPattern={providerSearchPattern}
            showLoadingState
          />
        </ShadowContainer>
      </Stack>
    </Stack>
  );
};
