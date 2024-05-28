import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import providerSorts from "@nadabot/common/lib/providerSorts";
import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import colors from "@nadabot/common/ui/colors";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import GridContainer from "@nadabot/common/ui/components/GridContainer";
import Input from "@nadabot/common/ui/components/Input";
import { Select } from "@nadabot/common/ui/components/Select";
import { ShadowContainer } from "@nadabot/common/ui/components/ShadowContainer";
import Tag from "@nadabot/common/ui/components/Tag";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import useFilteredProviders from "@nadabot/modules/core/hooks/useFilteredProviders";
import { useUser } from "@nadabot/modules/core/store/useUser";

import { GroupPreview } from "./GroupPreview";
import { StampCard } from "../../stamps/components/StampCard";
import { GROUP_RULE_TYPE_PARAMS } from "../constants";
import { GroupFormParameters, useGroupForm } from "../forms";
import { isRuleTypePrimitive } from "../lib";
import { GroupSchema } from "../models";

export type GroupInfoProps = GroupFormParameters & {};

export const GroupInfo: React.FC<GroupInfoProps> = ({ data }) => {
  const isNew = data.id === 0;
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);
  const isEditable = isNew || isEditModeEnabled;
  const { isAdmin: isViewedByAdmin } = useUser();

  const router = useRouter();
  const { maxWidth805 } = useBreakPoints();
  const enterEditMode = useCallback(() => setIsEditModeEnabled(true), []);
  const exitEditMode = useCallback(() => setIsEditModeEnabled(false), []);

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

  const {
    errors,
    handleChange,
    handleSubmit,
    isDisabled,
    isSubmitting,
    providerSelectHandler,
    resetForm,
    values,
  } = useGroupForm({
    data,
    onCreateSuccess: router.reload,
    onUpdateSuccess: exitEditMode,
  });

  const onCancelClick = useCallback(() => {
    resetForm();
    exitEditMode();
  }, [exitEditMode, resetForm]);

  const {
    title: ruleTypeTag,
    thresholdToDescription,
    color: ruleTypeColor,
  } = GROUP_RULE_TYPE_PARAMS[values.ruleType];

  const includedProviders = useMemo(
    () =>
      availableProviders.filter((provider) =>
        values.providers.includes(provider.id),
      ),

    [availableProviders, values.providers],
  );

  const displayedProviders = isEditable
    ? availableProviders
    : includedProviders;

  return (
    <Stack
      gap={4}
      component={isEditable ? "form" : "div"}
      onSubmit={handleSubmit}
    >
      {isEditable ? (
        <Stack gap={2} direction="row" justifyContent="space-between">
          <Stack>
            <Typography fontSize={40} fontWeight={700} lineHeight="48px">
              {`${isNew ? "Create" : "Edit"} Group`}
            </Typography>

            <Typography fontSize={16} fontWeight={400} color={colors.SECONDARY}>
              {isNew
                ? "Fill the following details to create a Rule"
                : thresholdToDescription(values.ruleThreshold ?? 0)}
            </Typography>
          </Stack>

          <Stack gap={1} direction="row">
            {!isNew && (
              <CustomButton type="reset" onClick={onCancelClick}>
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
          <Stack gap={2} direction="row" justifyContent="space-between">
            <Stack gap={3} direction="row">
              <GroupPreview providerIds={values.providers} size="medium" />

              <Stack gap={2}>
                <Typography fontSize={32} fontWeight={700} lineHeight="24px">
                  {values.group_name}
                </Typography>

                <Stack alignItems="start">
                  <Typography
                    fontSize={12}
                    fontWeight={700}
                    color={colors.NEUTRAL700}
                  >
                    {"Rule Type".toUpperCase()}
                  </Typography>

                  <Tag
                    color="#fff"
                    bgColor={ruleTypeColor}
                    fontWeight={600}
                    label={ruleTypeTag.toUpperCase()}
                  />
                </Stack>
              </Stack>
            </Stack>

            {isViewedByAdmin && (
              <Stack gap={1} direction="row">
                <CustomButton type="button" color="red" onClick={onDeleteClick}>
                  Delete
                </CustomButton>

                <CustomButton type="button" onClick={enterEditMode}>
                  Edit
                </CustomButton>
              </Stack>
            )}
          </Stack>

          <Stack gap={1}>
            <Typography fontSize={20} fontWeight={600}>
              About this rule type
            </Typography>

            <Typography fontSize={16} fontWeight={400}>
              {thresholdToDescription(values.ruleThreshold ?? 0)}
            </Typography>
          </Stack>
        </>
      )}

      {isEditable && (
        <>
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
        </>
      )}

      <Stack gap={0.5}>
        <Stack gap={2} direction="row">
          <Typography
            color={colors.NEUTRAL950}
            fontWeight={600}
            fontSize={16}
            noWrap
          >
            {isEditable
              ? "Select checks"
              : `Contains ${values.providers.length} checks`}
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

        <ShadowContainer sx={{ gap: 2 }}>
          <GridContainer centralize={displayedProviders.length >= 3}>
            {displayedProviders.map((provider) => (
              <StampCard
                key={provider.id}
                providerInfo={provider}
                selectable={isEditable && !isSubmitting}
                onSelectClick={providerSelectHandler(provider.id)}
                selected={values.providers.includes(provider.id)}
              />
            ))}
          </GridContainer>
        </ShadowContainer>
      </Stack>
    </Stack>
  );
};
