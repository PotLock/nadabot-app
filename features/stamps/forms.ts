import { FormikHelpers, useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFilePicker } from "use-file-picker";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  FileTypeValidator,
} from "use-file-picker/validators";

import {
  DEFAULT_ACCOUNT_ID_ARG_NAME,
  MAX_GAS,
} from "@nadabot/common/constants";
import { DIALOGS, useDialogs } from "@nadabot/common/contexts/dialogs";
import {
  daysToMilliseconds,
  millisecondsToDays,
} from "@nadabot/common/lib/time";
import { naxiosInstance } from "@nadabot/common/services/contracts";
import * as sybilContract from "@nadabot/common/services/contracts/sybil.nadabot";
import {
  ProviderExternal,
  ProviderId,
  UpdateProviderInput,
} from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";
import * as pinataServices from "@nadabot/common/services/pinata";
import { useProviders } from "@nadabot/common/store/useProviders";
import { useFormErrorLogger } from "@nadabot/common/ui/utils/forms";
import useSpinner from "@nadabot/common/ui/utils/useSpinner";

import { StampSchema, stampSchema } from "./models";

export type StampFormParameters = {
  id?: ProviderId;
};

export const useStampForm = ({ id }: StampFormParameters) => {
  const isNew = typeof id !== "number";
  const { showSpinner, hideSpinner } = useSpinner();
  const { openDialog } = useDialogs();
  const [iconFileCID, setIconFileCID] = useState<string | null>(null);

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
    dirty,
    handleChange: onValueChange,
    isSubmitting,
    setFieldValue,
    setValues,
    ...form
  } = useFormik<StampSchema>({
    validateOnChange: false,
    validationSchema: stampSchema,

    initialValues: {
      icon_url: "",
      provider_name: "",
      description: "",
      contract_id: "",
      method_name: "",
      account_id_arg_name: DEFAULT_ACCOUNT_ID_ARG_NAME,
      external_url: "",
      gas: 0,
    },

    onSubmit: async (
      {
        icon_url,
        provider_name,
        description,
        contract_id,
        method_name,
        account_id_arg_name = DEFAULT_ACCOUNT_ID_ARG_NAME,
        external_url,
        gas,
        custom_args,
      },

      { setFieldError },
    ) => {
      showSpinner();

      const contract = naxiosInstance.contractApi({
        contractId: contract_id,
      });

      // 1 - Check contract and method: The method must have a `account_id` parameter
      try {
        const response = await contract.view(method_name, {
          // e.g.: args: {account_id: "no.account.near"}
          args: {
            [account_id_arg_name]: "no.account.near",
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
        // 1.2 validate the `account_id_arg_name` parameter or other kind of contract error
        setFieldError(
          "method",
          `The contract/method does not exist or does not have an "${account_id_arg_name}" parameter.`,
        );

        hideSpinner();
        return;
      }

      // 2 - Upload image and get its CID
      // TODO: Upload the image only if `imagePickerValue` !== undefined

      if (typeof imagePickerValue === "string") {
        const fileCID = await pinataServices.uploadFile(imagePickerValue);

        if (fileCID === undefined) {
          setFieldError(
            "icon_url",
            "There was an issue while trying to upload the image!",
          );

          hideSpinner();
          return;
        } else setIconFileCID(fileCID);
      }

      const validatedGas = (gas && gas > MAX_GAS ? MAX_GAS : gas) ?? 0;
      // Convert to indivisible gas units
      // multiplying Tgas units by 10^12
      const providerGas =
        validatedGas > 0 ? validatedGas * 10 ** 12 : undefined;

      const iconUrl =
        typeof iconFileCID === "string"
          ? pinataServices.buildFileURL(iconFileCID)
          : icon_url;

      // 3 - Register / Update provider
      const txResult = isNew
        ? sybilContract.register_provider({
            provider_name,
            description,
            account_id_arg_name,
            method_name,
            contract_id,
            gas: providerGas,
            icon_url: iconUrl,
            external_url,
            custom_args,
          })
        : sybilContract.update_provider({
            provider_id: id,
            provider_name,
            description,
            account_id_arg_name,
            gas: providerGas,
            icon_url: iconUrl,
            external_url,
            custom_args,
          });

      txResult
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
            props: { title: "Error", description: errorMsg },
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

  useFormErrorLogger(form.errors);

  useEffect(() => {
    if (typeof imagePickerValue === "string") {
      setFieldValue("icon_url", imagePickerValue);
    }
  }, [filesContent, setFieldValue, imagePickerValue]);

  useEffect(() => {
    if (!isNew) {
      sybilContract.get_provider({ provider_id: id }).then((provider) => {
        if (provider !== undefined) setValues(provider);
      });
    }
  }, [id, isNew, setValues]);

  return {
    ...form,
    dirty,
    handleChange,
    isSubmitting,
    onImagePickerClick,
  };
};

export type StampAdminSettingsValues = Pick<
  UpdateProviderInput,
  "default_weight"
> & {
  stamp_validity_days: number;
};

export type StampAdminFormParameters = {
  isSubform?: boolean;
  disabled?: boolean;
  providerInfo: ProviderExternal;
};

export const useStampAdminForm = ({
  isSubform = false,
  disabled,
  providerInfo,
}: StampAdminFormParameters) => {
  const isStampValiditySet = providerInfo.stamp_validity_ms !== null;
  const { updateProvider } = useProviders();

  const [isExpiryEnabled, setIsExpiryEnabled] =
    useState<boolean>(isStampValiditySet);

  const initialValues: StampAdminSettingsValues = useMemo(
    () => ({
      default_weight: providerInfo.default_weight,

      stamp_validity_days: millisecondsToDays(
        providerInfo.stamp_validity_ms ?? 0,
      ),
    }),

    [providerInfo.default_weight, providerInfo.stamp_validity_ms],
  );

  const onSubmit = useCallback(
    async (
      { default_weight, stamp_validity_days }: StampAdminSettingsValues,
      { setSubmitting, resetForm }: FormikHelpers<StampAdminSettingsValues>,
    ) => {
      await sybilContract
        .update_provider({
          provider_id: providerInfo.id,
          default_weight,

          stamp_validity_ms: isExpiryEnabled
            ? daysToMilliseconds(stamp_validity_days)
            : null,
        })
        .then(({ id: provider_id, ...updated }) => {
          updateProvider({ provider_id, ...updated });

          resetForm({
            values: {
              default_weight: updated.default_weight,

              stamp_validity_days: millisecondsToDays(
                updated.stamp_validity_ms ?? 0,
              ),
            },
          });
        })
        .catch(console.error);

      setSubmitting(false);
    },

    [isExpiryEnabled, providerInfo.id, updateProvider],
  );

  const {
    dirty,
    handleChange,
    isSubmitting,
    isValid,
    setValues,
    values,
    ...form
  } = useFormik<StampAdminSettingsValues>({
    initialValues,
    onSubmit: isSubform ? () => void null : onSubmit,
  });

  useEffect(() => {
    if (isSubform && JSON.stringify(values) !== JSON.stringify(initialValues)) {
      setValues(initialValues);
    }
  }, [initialValues, isSubform, setValues, values]);

  const onExpirySwitch: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = useCallback((_, enabled) => setIsExpiryEnabled(enabled), []);

  const hasChanges = dirty || isExpiryEnabled !== isStampValiditySet;
  const isLocked = disabled || isSubmitting;

  useEffect(
    () => Object.values(form.errors).forEach(console.error),
    [form.errors],
  );

  return {
    ...form,
    handleChange,
    hasChanges,
    isLocked,
    isDisabled: isLocked || !hasChanges || !isValid,
    isExpiryEnabled,
    isSubmitting,
    onExpirySwitch,
    values,
  };
};
