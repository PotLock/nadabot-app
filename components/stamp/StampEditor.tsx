import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

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

import { StampSettingsFormParameters, useSettingsForm } from "./settingsForm";
import { StampAdminSettings } from "./StampAdminSettings";

export type StampEditorProps = StampSettingsFormParameters & {};

export const StampEditor: React.FC<StampEditorProps> = ({ id }) => {
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
  } = useSettingsForm({ id });

  const preview = (
    <StampCard
      isPreview
      sx={{
        minWidth: maxWidth430 ? "initial" : 392,
        backgroundColor: colors.WHITE,
      }}
      hidePoints
      providerInfo={{
        default_weight: 20,
        submitted_at_ms: 0,
        stamp_count: 0,
        account_id_arg_name: "account_id",
        status: ProviderStatus.Active,
        id: "",
        icon_url: values.imageURL,
        submitted_by: walletApi?.accounts[0]?.accountId,
        provider_name: values.title,
        description: values.description,
        contract_id: values.contractName,
        method_name: values.method,
        external_url: values.externalLink,
        is_user_a_human: false,
      }}
    />
  );

  return (
    <Stack component="form" onSubmit={handleSubmit}>
      {/* Stamp Inputs and Preview */}
      <Stack
        mb={1}
        mt={4}
        borderRadius="12px"
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
            previewFileContent={values.imageURL}
            errorMessage={errors.imageURL}
          />

          <Input
            name="title"
            disabled={isSubmitting}
            label="Title"
            placeholder="Enter a title"
            errorMessage={errors.title}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <Input
            name="description"
            disabled={isSubmitting}
            label="Description"
            placeholder="Describe what this check is"
            errorMessage={errors.description}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <Input
            name="contractName"
            disabled={isSubmitting}
            label="Contract ID (Address)"
            placeholder="Enter the contract address"
            errorMessage={errors.contractName}
            onChange={handleChange}
            sx={{ mt: 2 }}
            autoComplete
          />

          <Input
            name="method"
            disabled={isSubmitting}
            label="Method"
            placeholder="Enter a method"
            info="Method must take single input and return boolean"
            errorMessage={errors.method}
            onChange={handleChange}
            sx={{ mt: 2 }}
            autoComplete
          />

          <Input
            name="accountIdArgName"
            disabled={isSubmitting}
            label="Account Id Arg Name"
            placeholder="account_id"
            errorMessage={errors.accountIdArgName}
            onChange={handleChange}
            defaultValue={DEFAULT_ACCOUNT_ID_ARG_NAME}
            sx={{ mt: 2 }}
            autoComplete
          />

          <Input
            name="externalLink"
            disabled={isSubmitting}
            label="External link"
            placeholder="Enter an external link"
            errorMessage={errors.externalLink}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />

          <Input
            name="gas"
            disabled={isSubmitting}
            label="Minimum Required Gas Units, TGas"
            placeholder="Enter the minimum TGas units"
            type="number"
            errorMessage={errors.gas}
            defaultValue={0}
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

          <Box mt={4}>{preview}</Box>
        </Stack>
      </Stack>

      {isAdmin && (
        <StampAdminSettings
          heading="Points and Expiry"
          providerInfo={values}
          onSubmit={() => {}}
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
          color="beige"
          sx={{ width: maxWidth600 ? "40%" : "25%" }}
          onClick={router.back}
        >
          Go Back
        </CustomButton>

        <CustomButton
          type="submit"
          bodySize="medium"
          color="blue"
          sx={{ width: maxWidth600 ? "58%" : "73%" }}
        >
          Final Submit
        </CustomButton>
      </Stack>
    </Stack>
  );
};
