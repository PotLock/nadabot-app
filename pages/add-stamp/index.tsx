import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Container, Stack, Tooltip, Typography } from "@mui/material";
import { Network, getContractApi } from "@wpdas/naxios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import * as Yup from "yup";

import ProtectedPage from "@nadabot/components/auth/ProtectedPage";
import ContractInfo from "@nadabot/components/ContractInfo";
import CustomButton from "@nadabot/components/ui/CustomButton";
import Input from "@nadabot/components/ui/Input";
import UploadImage from "@nadabot/components/UploadImage";
import { DIALOGS } from "@nadabot/contexts/DialogsProvider";
import useBreakPoints from "@nadabot/hooks/useBreakPoints";
import useDialogs from "@nadabot/hooks/useDialogs";
import useSpinner from "@nadabot/hooks/useSpinner";
import useTransactionDetection from "@nadabot/hooks/useTransactionDetection";
import * as pinataServices from "@nadabot/services/pinata";
import {
  MAX_GAS,
  MAX_PROVIDER_DESCRIPTION_LENGTH,
  MAX_PROVIDER_EXTERNAL_URL_LENGTH,
  MAX_PROVIDER_NAME_LENGTH,
  NETWORK,
} from "@nadabot/services/web3/constants";
import * as sybilContractInterface from "@nadabot/services/web3/contract-interface";
import { ProviderStatus } from "@nadabot/services/web3/interfaces/providers";
import { walletApi } from "@nadabot/services/web3/web3api";
import colors from "@nadabot/theme/colors";

const formSchema = Yup.object().shape({
  imageURL: Yup.string()
    .min(4, "You should attach an image")
    .required("Attach an image"),
  title: Yup.string()
    .min(4, "Insert a valid title")
    .max(
      MAX_PROVIDER_NAME_LENGTH,
      `Title shouldn't exceed ${MAX_PROVIDER_NAME_LENGTH} characters`,
    )
    .required("Insert a valid title"),
  description: Yup.string()
    .min(4, "Insert a valid description")
    .max(
      MAX_PROVIDER_DESCRIPTION_LENGTH,
      `Description shouldn't exceed ${MAX_PROVIDER_DESCRIPTION_LENGTH} characters`,
    )
    .required("Insert a valid description"),
  contractName: Yup.string()
    .min(4, "Insert a valid contract address name")
    .required("Insert a valid contract name"),
  method: Yup.string()
    .min(3, "Insert a valid method")
    .required("Insert a valid method"),
  externalLink: Yup.string()
    .min(4, "Insert a valid external link")
    .max(
      MAX_PROVIDER_EXTERNAL_URL_LENGTH,
      `Link shouldn't exceed ${MAX_PROVIDER_EXTERNAL_URL_LENGTH} characters`,
    )
    .required("Insert a valid external link"),
});

const DEFAULT_ARG_NAME = "account_id";

export default function AddStampPage() {
  const router = useRouter();
  const { showSpinner, hideSpinner } = useSpinner();
  const { openDialog } = useDialogs();
  const { maxWidth1200, maxWidth962, maxWidth600, maxWidth430 } =
    useBreakPoints();
  const { openFilePicker, filesContent } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["jpg", "png", "svg"]),
      new FileSizeValidator({ maxFileSize: 4 * 1024 * 1024 /* 4 MB */ }),
    ],
  });

  // Check if there was an transaction, if so, show the "Done" Dialog
  const transactionCompleted = useTransactionDetection();
  useEffect(() => {
    if (transactionCompleted) {
      openDialog({ dialog: DIALOGS.StampSent });
    }
  }, [transactionCompleted, openDialog]);

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      imageURL: "",
      title: "",
      description: "",
      contractName: "",
      method: "",
      accountIdArgName: DEFAULT_ARG_NAME,
      externalLink: "",
      gas: 0,
    },
    validationSchema: formSchema,
    onSubmit: async ({
      title,
      description,
      contractName,
      method,
      accountIdArgName,
      externalLink,
      gas,
    }) => {
      showSpinner();

      const contract = await getContractApi({
        contractId: contractName,
        network: NETWORK as Network,
      });

      // 1 - Check contract and method: The method must have a `account_id` parameter
      try {
        const response = await contract.view(method, {
          // e.g.: args: {account_id: "no.account.near"}
          args: { [accountIdArgName || DEFAULT_ARG_NAME]: "no.account.near" },
        });

        // 1.1 validate if the response is a boolean
        // NOTE: this returns an array of validated humans [should break]: registry-v2.i-am-human.testnet
        // NOTE: this returns an boolean [should work]:
        if (typeof response !== "boolean") {
          formik.setFieldError(
            "method",
            `The return is not a boolean, it is a${
              Array.isArray(response) ? "n array" : ` ${typeof response}`
            }!`,
          );
          hideSpinner();
          return;
        }
      } catch (error) {
        // 1.2 validate the `accountIdArgName` parameter or other kind of contract error
        formik.setFieldError(
          "method",
          `The contract/method does not exist or does not have an "${accountIdArgName || DEFAULT_ARG_NAME}" parameter.`,
        );
        hideSpinner();
        return;
      }

      // 2 - Upload the image
      // Upload image and get its CID
      const iconImageCID = await pinataServices.uploadFile(
        filesContent[0].content,
      );
      if (!iconImageCID) {
        // Validate image upload
        formik.setFieldError(
          "imageURL",
          "There was an issue while trying to upload the image!",
        );
        hideSpinner();
        return;
      }

      const validatedGas = gas && gas > MAX_GAS ? MAX_GAS : gas;
      // Convert to indivisable gas units
      // multiplying Tgas units by 10^12
      const providerGas =
        validatedGas > 0 ? validatedGas * 10 ** 12 : undefined;

      // 3 - Register Stamp/Check
      sybilContractInterface
        .register_provider({
          contract_id: contractName,
          method_name: method,
          account_id_arg_name: accountIdArgName || DEFAULT_ARG_NAME,
          name: title,
          description,
          gas: providerGas,
          icon_url: pinataServices.buildFileURL(iconImageCID),
          external_url: externalLink,
        })
        .then(() => {
          hideSpinner();

          // 4 - Show DONE Dialog -> this is going to take user to HOME page
          openDialog({ dialog: DIALOGS.StampSent });
        })
        .catch((error) => {
          hideSpinner();

          const errorObj = JSON.parse(error.message);
          const errorMsg = errorObj.kind.ExecutionError as string;

          openDialog({
            dialog: DIALOGS.Error,
            props: {
              title: "Error",
              description: errorMsg,
            },
          });
        });
    },
  });

  // Updates the formik.imageURL field
  useEffect(() => {
    if (filesContent[0]) {
      formik.setFieldValue("imageURL", filesContent[0]?.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesContent, formik.setFieldValue]);

  const goBackHanler = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <ProtectedPage>
      <Container>
        <Tooltip
          title={
            <Link href="https://docs.nada.bot/" target="_blank">
              See the Docs here
            </Link>
          }
        >
          <Stack>
            <Typography variant="h4" fontWeight={700}>
              Add Stamp/Check
            </Typography>
            <Typography color={colors.SECONDARY} fontSize={16}>
              A stamp is a smart-contract enabled check on NEAR to be added to
              the nadabot sybil registry, to verify something about an account
              whether it be a role, identity, proof of ownership, or behavior.
            </Typography>
          </Stack>
        </Tooltip>

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
              onClick={openFilePicker}
              previewFileContent={filesContent[0]?.content}
              errorMessage={formik.errors.imageURL}
            />
            <Input
              name="title"
              disabled={formik.isSubmitting}
              label="Title"
              placeholder="Enter a title"
              errorMessage={formik.errors.title}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
            />
            <Input
              name="description"
              disabled={formik.isSubmitting}
              label="Description"
              placeholder="Describe what this check is"
              errorMessage={formik.errors.description}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
            />
            <Input
              name="contractName"
              disabled={formik.isSubmitting}
              label="Contract ID (Address)"
              placeholder="Enter the contract address"
              errorMessage={formik.errors.contractName}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
              autoComplete
            />
            <Input
              name="method"
              disabled={formik.isSubmitting}
              label="Method"
              placeholder="Enter a method"
              info="Method must take single input and return boolean"
              errorMessage={formik.errors.method}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
              autoComplete
            />
            <Input
              name="accountIdArgName"
              disabled={formik.isSubmitting}
              label="Account Id Arg Name"
              placeholder="account_id"
              errorMessage={formik.errors.accountIdArgName}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
              autoComplete
            />
            <Input
              name="externalLink"
              disabled={formik.isSubmitting}
              label="External link"
              placeholder="Enter an external link"
              errorMessage={formik.errors.externalLink}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
            />
            <Input
              name="gas"
              disabled={formik.isSubmitting}
              label="Minimum Required Gas Units, TGas"
              placeholder="Enter the minimum TGas units"
              type="number"
              errorMessage={formik.errors.gas}
              defaultValue={0}
              onChange={formik.handleChange}
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
              <ContractInfo
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
                  provider_id: "",
                  icon_url: filesContent[0]?.content,
                  submitted_by: walletApi?.accounts[0]?.accountId,
                  name: formik.values.title,
                  description: formik.values.description,
                  contract_id: formik.values.contractName,
                  method_name: formik.values.method,
                  external_url: formik.values.externalLink,
                }}
              />
            </Box>
          </Stack>
        </Stack>
        {/* Buttons */}
        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          mt={2}
          mb={2}
        >
          <CustomButton
            bodySize="medium"
            color="beige"
            sx={{ width: maxWidth600 ? "40%" : "25%" }}
            onClick={goBackHanler}
          >
            Go Back
          </CustomButton>
          <CustomButton
            bodySize="medium"
            color="blue"
            sx={{ width: maxWidth600 ? "58%" : "73%" }}
            onClick={formik.handleSubmit}
          >
            Final Submit
          </CustomButton>
        </Stack>
      </Container>
    </ProtectedPage>
  );
}
