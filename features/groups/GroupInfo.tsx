import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import providerSorts from "@nadabot/common/lib/providerSorts";
import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import { useUser } from "@nadabot/common/store/useUser";
import colors from "@nadabot/common/ui/colors";
import { AddFilterSearchInput } from "@nadabot/common/ui/components/AddFilterSearchInput";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import Input from "@nadabot/common/ui/components/Input";
import { Select } from "@nadabot/common/ui/components/Select";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import useFilteredProviders from "@nadabot/hooks/useFilteredProviders";

import { GROUP_RULE_TYPE_PARAMS } from "./constants";
import { GroupFormParameters, useGroupForm } from "./forms";
import { isRuleTypePrimitive } from "./lib";
import { GroupSchema } from "./models";
import StampsOverview from "../stamps/StampsOverview";

export type GroupInfoProps = GroupFormParameters & {};

export const GroupInfo: React.FC<GroupInfoProps> = ({ data }) => {
  const isNew = data.id === 0;
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(isNew);
  const { isAdmin: isViewedByAdmin } = useUser();
  const onEditClick = useCallback(() => setIsEditModeEnabled(true), []);
  const onCancelClick = useCallback(() => setIsEditModeEnabled(false), []);
  const router = useRouter();
  const { maxWidth805 } = useBreakPoints();
  const [providerSearchPattern, setProviderSearchPattern] = useState("");

  const onDeleteClick = useCallback(
    () =>
      void sybilContract
        .delete_group({ group_id: data.id })
        .finally(() => router.reload()),

    [data.id, router],
  );

  const { all: availableProviders } = useFilteredProviders({
    sortMethod: providerSorts.higherWeightFirst,
  });

  const includedProviders = useMemo(
    () =>
      availableProviders.filter((provider) =>
        data.providers.includes(provider.id),
      ),

    [availableProviders, data.providers],
  );

  const {
    errors,
    handleChange,
    handleSubmit,
    isDisabled,
    isSubmitting,
    providerSelectHandler,
    values,
  } = useGroupForm({ data, onGroupCreate: router.reload });

  return (
    <Stack gap={4} component="form" onSubmit={handleSubmit}>
      {isEditModeEnabled ? (
        <Stack gap={2} direction="row" justifyContent="space-between">
          <Stack>
            <Typography fontSize={40} fontWeight={700} lineHeight="48px">
              {`${isNew ? "Create" : "Edit"} Group`}
            </Typography>

            {isNew && (
              <Typography
                fontSize={16}
                fontWeight={400}
                color={colors.SECONDARY}
              >
                Fill the following details to create a Rule
              </Typography>
            )}
          </Stack>

          <Stack gap={1}>
            {!isNew && (
              <CustomButton
                type="reset"
                onClick={onCancelClick}
                disabled={isDisabled}
              >
                Cancel
              </CustomButton>
            )}

            <CustomButton
              type="submit"
              color="blue"
              progress={isSubmitting}
              disabled={isDisabled}
            >
              {isNew ? "Create Group" : "Save Changes"}
            </CustomButton>
          </Stack>
        </Stack>
      ) : (
        <>
          {isViewedByAdmin && (
            <Stack gap={1}>
              <CustomButton color="red" onClick={onDeleteClick}>
                Delete
              </CustomButton>

              <CustomButton onClick={onEditClick}>Edit</CustomButton>
            </Stack>
          )}
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
          disabled={isSubmitting}
          sx={{ width: "100%" }}
        />

        <Select<GroupSchema["ruleType"]>
          label="Rule type"
          name="ruleType"
          options={Object.values(GROUP_RULE_TYPE_PARAMS)}
          value={values.ruleType}
          onChange={handleChange}
          disabled={isSubmitting}
          width={maxWidth805 ? "100%" : "45%"}
        />
      </Stack>

      {!isRuleTypePrimitive(values.ruleType) && (
        <Input
          label="Threshold points"
          name="ruleThreshold"
          type="number"
          integersOnly
          min={1}
          defaultValue={values.ruleThreshold ?? undefined}
          optional={values.ruleType === "Sum"}
          errorMessage={errors.ruleThreshold}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      )}

      <Stack gap={0.5}>
        <Stack gap={2} direction="row">
          <Typography
            color={colors.NEUTRAL950}
            fontWeight={600}
            fontSize={16}
            noWrap
          >
            Select checks
          </Typography>

          {(errors.providers?.length ?? 0) > 0 && (
            <Stack gap={0.5} direction="row" alignItems="center">
              <ErrorRoundedIcon
                fontSize="small"
                sx={{ color: colors.ERROR_RED }}
              />

              <Typography color={colors.ERROR_RED} fontSize={16}>
                {errors.providers}
              </Typography>
            </Stack>
          )}
        </Stack>

        <ShadowContainer>
          {availableProviders.length > 0 && (
            <AddFilterSearchInput
              onChange={setProviderSearchPattern}
              hideAddFilterButton
            />
          )}

          <StampsOverview
            providersList={
              isEditModeEnabled ? availableProviders : includedProviders
            }
            searchPattern={providerSearchPattern}
            showLoadingState
            selectedStamps={values.providers}
            stampSelectHandler={
              isEditModeEnabled && !isSubmitting
                ? providerSelectHandler
                : undefined
            }
          />
        </ShadowContainer>
      </Stack>
    </Stack>
  );
};
