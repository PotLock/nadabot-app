import { useFormik } from "formik";
import { useCallback, useEffect } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";
import { object, string } from "yup";

import {
  DEFAULT_ACCOUNT_ID_ARG_NAME,
  MAX_GAS,
  MAX_PROVIDER_DESCRIPTION_LENGTH,
  MAX_PROVIDER_EXTERNAL_URL_LENGTH,
  MAX_PROVIDER_NAME_LENGTH,
} from "@nadabot/constants";
import { DIALOGS } from "@nadabot/contexts/DialogsProvider";
import useDialogs from "@nadabot/hooks/useDialogs";
import useSpinner from "@nadabot/hooks/useSpinner";
import { naxiosInstance } from "@nadabot/services/contracts";
import * as sybilContract from "@nadabot/services/contracts/sybil.nadabot";
import { ProviderExternal } from "@nadabot/services/contracts/sybil.nadabot/interfaces/providers";
import * as pinataServices from "@nadabot/services/pinata";

const formSchema = object().shape({
  imageURL: string()
    .min(4, "You should attach an image")
    .required("Attach an image"),

  title: string()
    .min(4, "Insert a valid title")
    .max(
      MAX_PROVIDER_NAME_LENGTH,
      `Title shouldn't exceed ${MAX_PROVIDER_NAME_LENGTH} characters`,
    )
    .required("Insert a valid title"),

  description: string()
    .min(4, "Insert a valid description")
    .max(
      MAX_PROVIDER_DESCRIPTION_LENGTH,
      `Description shouldn't exceed ${MAX_PROVIDER_DESCRIPTION_LENGTH} characters`,
    )
    .required("Insert a valid description"),

  contractName: string()
    .min(4, "Insert a valid contract address name")
    .required("Insert a valid contract name"),

  method: string()
    .min(3, "Insert a valid method")
    .required("Insert a valid method"),

  externalLink: string()
    .min(4, "Insert a valid external link")
    .max(
      MAX_PROVIDER_EXTERNAL_URL_LENGTH,
      `Link shouldn't exceed ${MAX_PROVIDER_EXTERNAL_URL_LENGTH} characters`,
    )
    .required("Insert a valid external link"),
});

export type StampSettingsFormParameters = {
  id?: ProviderExternal["id"];
};

export const useSettingsForm = ({ id }: StampSettingsFormParameters) => {
  const isNew = typeof id !== "string";
  const { showSpinner, hideSpinner } = useSpinner();
  const { openDialog } = useDialogs();

  const { openFilePicker: onImagePickerClick, filesContent } = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,

    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      new FileTypeValidator(["jpg", "png", "svg"]),
      new FileSizeValidator({ maxFileSize: 4 * 1024 * 1024 /* 4 MB */ }),
    ],
  });

  const imagePickerValue = filesContent.at(0)?.content;

  const {
    handleChange: onValueChange,
    isSubmitting,
    resetForm,
    setFieldValue,
    ...form
  } = useFormik({
    validateOnChange: false,
    validationSchema: formSchema,

    initialValues: {
      imageURL: "",
      title: "",
      description: "",
      contractName: "",
      method: "",
      externalLink: "",

      accountIdArgName: DEFAULT_ACCOUNT_ID_ARG_NAME,
      gas: 0,
    },

    onSubmit: async (
      {
        title,
        description,
        contractName,
        method,
        accountIdArgName,
        externalLink,
        gas,
      },

      { setFieldError },
    ) => {
      showSpinner();

      const contract = await naxiosInstance.contractApi({
        contractId: contractName,
      });

      // 1 - Check contract and method: The method must have a `account_id` parameter
      try {
        const response = await contract.view(method, {
          // e.g.: args: {account_id: "no.account.near"}
          args: {
            [accountIdArgName || DEFAULT_ACCOUNT_ID_ARG_NAME]:
              "no.account.near",
          },
        });

        // 1.1 validate if the response is a boolean
        // NOTE: this returns an array of validated humans [should break]: registry-v2.i-am-human.testnet
        // NOTE: this returns an boolean [should work]:
        if (typeof response !== "boolean") {
          setFieldError(
            "method",
            `The return is not a boolean, it is a${Array.isArray(response) ? "n array" : ` ${typeof response}`}!`,
          );

          hideSpinner();
          return;
        }
      } catch (error) {
        // 1.2 validate the `accountIdArgName` parameter or other kind of contract error
        setFieldError(
          "method",
          `The contract/method does not exist or does not have an "${accountIdArgName || DEFAULT_ACCOUNT_ID_ARG_NAME}" parameter.`,
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
        setFieldError(
          "imageURL",
          "There was an issue while trying to upload the image!",
        );

        hideSpinner();
        return;
      }

      const validatedGas = gas && gas > MAX_GAS ? MAX_GAS : gas;
      // Convert to indivisible gas units
      // multiplying Tgas units by 10^12
      const providerGas =
        validatedGas > 0 ? validatedGas * 10 ** 12 : undefined;

      // 3 - Register Stamp/Check
      sybilContract
        .register_provider({
          contract_id: contractName,
          method_name: method,
          account_id_arg_name: accountIdArgName || DEFAULT_ACCOUNT_ID_ARG_NAME,
          provider_name: title,
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

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event);
      form.setErrors({ ...form.errors, [event.target.name]: "" });
    },

    [form, onValueChange],
  );

  useEffect(() => {
    if (typeof imagePickerValue === "string") {
      setFieldValue("imageURL", imagePickerValue);
    }
  }, [filesContent, setFieldValue, imagePickerValue]);

  useEffect(() => {
    if (!isNew) {
      sybilContract.get_provider({ provider_id: id }).then((provider) => {
        if (provider !== undefined) resetForm(provider);
      });
    }
  }, [id, isNew, resetForm]);

  return { ...form, handleChange, isSubmitting, onImagePickerClick };
};
