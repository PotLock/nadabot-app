import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { StampCard } from "@nadabot/components/stamp/StampCard";
import CustomButton from "@nadabot/components/ui/CustomButton";
import Input from "@nadabot/components/ui/Input";
import UploadImage from "@nadabot/components/UploadImage";
import { DEFAULT_ACCOUNT_ID_ARG_NAME, MAX_GAS } from "@nadabot/constants";
import { useUser } from "@nadabot/hooks/store/useUser";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import { walletApi } from "@nadabot/services/contracts";
import { ProviderStatus } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import colors from "@nadabot/theme/colors";

import { StampAdminSettings } from "./StampAdminSettings";
import { StampSettingsFormParameters, useStampForm } from "./stampForm";

export type StampEditorProps = StampSettingsFormParameters & {};

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
    onImagePickerClick,
    values,
  } = useStampForm({ id });

  console.log(values);

  const providerInfo = useMemo(
    () => ({
      id: id ?? 0,
      status: ProviderStatus.Active,
      submitted_at_ms: 0,
      submitted_by: walletApi?.accounts[0]?.accountId,
      default_weight: 20,
      stamp_count: 0,
      account_id_arg_name: DEFAULT_ACCOUNT_ID_ARG_NAME,
      is_user_a_human: false,
      ...values,
    }),

    [id, values],
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
          width={maxWidth962 ? "100%" : maxWidth1200 ? "50%" : "60%"}
          p={4}
        >
          <UploadImage
            onClick={onImagePickerClick}
            previewFileContent={values.icon_url}
            errorMessage={errors.icon_url}
          />

          <Input
            name="provider_name"
            disabled={isSubmitting}
            label="Title"
            placeholder="Enter a title"
            errorMessage={errors.provider_name}
            defaultValue={values.provider_name}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <Input
            name="description"
            disabled={isSubmitting}
            label="Description"
            placeholder="Describe what this check is"
            errorMessage={errors.description}
            defaultValue={values.description}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          {isNew && (
            <Input
              name="contract_id"
              disabled={isSubmitting}
              label="Contract ID (Address)"
              placeholder="Enter the contract address"
              errorMessage={errors.contract_id}
              defaultValue={values.contract_id}
              onChange={handleChange}
              sx={{ mt: 2 }}
              autoComplete
            />
          )}

          {isNew && (
            <Input
              name="method_name"
              disabled={isSubmitting}
              label="Method name"
              placeholder="Enter a method name"
              info="Method must take single input and return boolean"
              errorMessage={errors.method_name}
              defaultValue={values.method_name}
              onChange={handleChange}
              sx={{ mt: 2 }}
              autoComplete
            />
          )}

          <Input
            name="account_id_arg_name"
            disabled={isSubmitting}
            label="Account id argument name"
            placeholder="account_id"
            errorMessage={errors.account_id_arg_name}
            defaultValue={values.account_id_arg_name}
            onChange={handleChange}
            sx={{ mt: 2 }}
            autoComplete
          />

          <Input
            name="external_url"
            disabled={isSubmitting}
            label="External link"
            placeholder="Enter an external link"
            errorMessage={errors.external_url}
            defaultValue={values.external_url}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <Input
            name="gas"
            disabled={isSubmitting}
            label="Minimum required gas units, TGas"
            placeholder="Enter the minimum TGas units"
            type="number"
            errorMessage={errors.gas}
            defaultValue={values.gas ?? undefined}
            onChange={handleChange}
            min={0}
            max={MAX_GAS}
            integersOnly
            optional
            sx={{ mt: 2 }}
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
              sx={{
                minWidth: maxWidth430 ? "initial" : 392,
                backgroundColor: colors.WHITE,
              }}
              hidePoints
              {...{ providerInfo }}
            />
          </Box>
        </Stack>
      </Stack>

      {isAdmin && (
        <StampAdminSettings onChange={handleChange} {...{ providerInfo }} />
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
