import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo } from "react";

import {
  DEFAULT_ACCOUNT_ID_ARG_NAME,
  MAX_GAS,
} from "@nadabot/common/constants";
import { daysToMilliseconds } from "@nadabot/common/lib/time";
import { walletApi } from "@nadabot/common/services/contracts";
import { ProviderStatus } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/common/ui/colors";
import CustomButton from "@nadabot/common/ui/components/CustomButton";
import Input from "@nadabot/common/ui/components/Input";
import UploadImage from "@nadabot/common/ui/components/UploadImage";
import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";
import { useUser } from "@nadabot/modules/core/store/useUser";

import { StampAdminSettings } from "./StampAdminSettings";
import { StampCard } from "./StampCard";
import { StampFormParameters, useStampForm } from "../forms";

export type StampEditorProps = StampFormParameters & {};

export const StampEditor: React.FC<StampEditorProps> = ({ id }) => {
  const isNew = typeof id !== "number";
  const { isAdmin } = useUser();
  const router = useRouter();

  const { maxWidth1200, maxWidth962, maxWidth600, maxWidth430 } =
    useBreakPoints();

  const {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    onExpiryOff,
    onImagePickerClick,
    imagePickerValue,
    values,
  } = useStampForm({ id, onUpdateSuccess: router.back });

  const { stampValidityDays } = values;

  const providerPreviewData = useMemo(
    () => ({
      id: id ?? 0,
      status: ProviderStatus.Active,
      submitted_at_ms: 0,
      submitted_by: walletApi?.accounts[0]?.accountId,
      default_weight: 20,
      stamp_count: 0,
      account_id_arg_name: DEFAULT_ACCOUNT_ID_ARG_NAME,
      is_user_a_human: false,

      stamp_validity_ms:
        typeof stampValidityDays === "number"
          ? daysToMilliseconds(stampValidityDays)
          : stampValidityDays,

      ...values,
      icon_url: imagePickerValue ?? values.icon_url,
    }),

    [id, imagePickerValue, stampValidityDays, values],
  );

  return (
    <Stack gap={2} component="form" onSubmit={handleSubmit}>
      {/* Stamp Inputs and Preview */}
      <Stack
        mt={4}
        borderRadius={2}
        boxShadow={`0px 0px 8px 0px ${colors.SHADOWGRAY}`}
        border={`1px solid ${colors.SHADOWGRAY}`}
        direction={maxWidth962 ? "column-reverse" : "row"}
      >
        {/* Inputs */}
        <Stack
          p={4}
          gap={2}
          width={maxWidth962 ? "100%" : maxWidth1200 ? "50%" : "60%"}
        >
          <UploadImage
            onClick={onImagePickerClick}
            previewFileContent={values.icon_url}
            errorMessage={errors.icon_url}
          />

          <Input
            name="provider_name"
            label="Title"
            placeholder="Enter a title"
            defaultValue={values.provider_name}
            errorMessage={errors.provider_name}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          <Input
            name="description"
            label="Description"
            placeholder="Describe what this check is"
            defaultValue={values.description}
            errorMessage={errors.description}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          {isNew && (
            <Input
              name="contract_id"
              label="Contract ID (Address)"
              placeholder="Enter the contract address"
              defaultValue={values.contract_id}
              errorMessage={errors.contract_id}
              autoComplete
              disabled={isSubmitting}
              onChange={handleChange}
            />
          )}

          {isNew && (
            <Input
              name="method_name"
              label="Method Name"
              placeholder="Enter a method name"
              info="Method must take single input and return boolean"
              defaultValue={values.method_name}
              errorMessage={errors.method_name}
              autoComplete
              disabled={isSubmitting}
              onChange={handleChange}
            />
          )}

          <Input
            name="account_id_arg_name"
            label="Account ID Argument Name"
            placeholder="account_id"
            defaultValue={values.account_id_arg_name}
            errorMessage={errors.account_id_arg_name}
            autoComplete
            disabled={isSubmitting}
            onChange={handleChange}
          />

          {/* Custom Args */}
          <Input
            name="custom_args"
            label="Custom Arguments"
            placeholder={`{"types":["new","old"]}`}
            defaultValue={values.custom_args ?? undefined}
            errorMessage={errors.custom_args}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          <Input
            name="external_url"
            label="External Link"
            placeholder="Enter an external link"
            defaultValue={values.external_url}
            errorMessage={errors.external_url}
            disabled={isSubmitting}
            onChange={handleChange}
          />

          <Input
            name="gas"
            label="Minimum required Gas Units, TGas"
            placeholder="Enter the minimum TGas units"
            type="number"
            min={0}
            max={MAX_GAS}
            defaultValue={values.gas ?? undefined}
            errorMessage={errors.gas}
            integersOnly
            optional
            disabled={isSubmitting}
            onChange={handleChange}
          />
        </Stack>

        {/* Preview */}
        <Stack
          width={maxWidth962 ? "100%" : maxWidth1200 ? "50%" : "40%"}
          alignItems={maxWidth1200 ? "center" : "flex-start"}
          bgcolor={colors.GRAY100}
          p={4}
          borderLeft={`1px solid ${colors.SHADOWGRAY}`}
        >
          <Stack direction="row" alignItems="center">
            <Typography fontWeight={700} fontSize={24} mr={1}>
              Stamp Card Preview
            </Typography>

            <InfoOutlinedIcon sx={{ color: colors.NEUTRAL300 }} />
          </Stack>

          <Typography fontWeight={400} color={colors.NEUTRAL400}>
            This is the preview of your submitted Stamp
          </Typography>

          <Box mt={4}>
            <StampCard
              isPreview
              providerInfo={providerPreviewData}
              hidePoints
              sx={{
                minWidth: maxWidth430 ? "initial" : 392,
                backgroundColor: colors.WHITE,
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {isAdmin && (
        <StampAdminSettings
          onChange={handleChange}
          data={providerPreviewData}
          {...{ onExpiryOff }}
        />
      )}

      <Stack
        direction="row"
        width="100%"
        justifyContent="space-between"
        mt={2}
        mb={2}
      >
        <CustomButton
          type="button"
          bodySize="medium"
          color="red"
          variant="outlined"
          sx={{ width: maxWidth600 ? "40%" : "25%" }}
          onClick={router.back}
        >
          Cancel
        </CustomButton>

        <CustomButton
          type="submit"
          bodySize="medium"
          color="black"
          sx={{ width: maxWidth600 ? "58%" : "73%" }}
        >
          {`${isNew ? "Submit" : "Save settings"}`}
        </CustomButton>
      </Stack>
    </Stack>
  );
};
