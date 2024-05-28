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
import { useFormErrorLogger } from "@nadabot/common/ui/utils/forms";
import useSpinner from "@nadabot/common/ui/utils/globalSpinner";
import { useProviders } from "@nadabot/modules/core/store/useProviders";

import { StampSchema, stampSchema } from "./models";

export type StampFormParameters = {
  id?: ProviderId;
  onUpdateSuccess?: VoidFunction;
};

export const useStampForm = ({ id, onUpdateSuccess }: StampFormParameters) => {
  const isNew = typeof id !== "number";
  const { updateProvider } = useProviders();
  const { showSpinner, hideSpinner } = useSpinner();
  const { openDialog } = useDialogs();
  const [iconFileCID, setIconFileCID] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<StampSchema>({
    icon_url: "",
    provider_name: "",
    description: "",
    contract_id: "",
    method_name: "",
    account_id_arg_name: DEFAULT_ACCOUNT_ID_ARG_NAME,
    external_url: "",
    gas: 0,
  });

  const refreshInitialValues = (data?: ProviderExternal) => {
    if (data !== undefined) {
      const { stamp_validity_ms, custom_args, ...provider } = data;

      setInitialValues({
        ...provider,
        custom_args: typeof custom_args === "string" ? custom_args : undefined,

        stampValidityDays:
          typeof stamp_validity_ms === "number"
            ? millisecondsToDays(stamp_validity_ms ?? 0)
            : stamp_validity_ms,
      });
    }
  };

  useEffect(() => {
    if (!isNew) {
      sybilContract
        .get_provider({ provider_id: id })
        .then(refreshInitialValues);
    }
  }, [id, isNew]);

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

  const imagePickerValue = filesContent.at(0)?.content;

  const {
    dirty,
    handleChange: onValueChange,
    isSubmitting,
    setFieldValue,
    values,
    ...form
  } = useFormik<StampSchema>({
    initialValues,
    enableReinitialize: true,
    validationSchema: stampSchema,
    validateOnChange: false,

    onSubmit: async (
      {
        icon_url,
        contract_id,
        method_name,
        account_id_arg_name = DEFAULT_ACCOUNT_ID_ARG_NAME,
        gas,
        stampValidityDays,
        ...formValues
      },

      actions,
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
          actions.setFieldError(
            "method",
            `The return is not a boolean, it is a${Array.isArray(response) ? "n array" : ` ${typeof response}`}!`,
          );

          hideSpinner();
          return;
        }
      } catch (error) {
        // 1.2 validate the `account_id_arg_name` parameter or other kind of contract error
        actions.setFieldError(
          "method",
          `The contract/method does not exist or does not have an "${account_id_arg_name}" parameter.`,
        );

        hideSpinner();
        return;
      }

      // 2 - Upload image and get its CID
      if (typeof imagePickerValue === "string") {
        const fileCID = await pinataServices.uploadFile(imagePickerValue);

        if (fileCID === undefined) {
          actions.setFieldError("icon_url", "Unable to upload the image!");
          return void hideSpinner();
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

      const stamp_validity_ms =
        typeof stampValidityDays === "number"
          ? daysToMilliseconds(stampValidityDays)
          : stampValidityDays;

      // 3 - Register / Update provider
      const txResult = isNew
        ? sybilContract.register_provider({
            ...formValues,
            account_id_arg_name,
            method_name,
            contract_id,
            gas: providerGas,
            icon_url: iconUrl,
            stamp_validity_ms,
          })
        : sybilContract.update_provider({
            ...formValues,
            provider_id: id,
            account_id_arg_name,
            gas: providerGas,
            icon_url: iconUrl,
            stamp_validity_ms,
          });

      txResult
        .then(({ id, ...resultData }) => {
          if (isNew) {
            // 4 - Show DONE Dialog -> this is going to take user to HOME page
            openDialog({ dialog: DIALOGS.StampSent });
          } else {
            updateProvider({ provider_id: id, ...resultData });
            onUpdateSuccess?.();
          }
        })
        .catch((error) => {
          openDialog({
            dialog: DIALOGS.Error,

            props: {
              title: "Error",

              description: JSON.parse(error.message).kind
                .ExecutionError as string,
            },
          });
        })
        .finally(() => hideSpinner());
    },
  });

  const onExpiryOff = useCallback(
    () => setFieldValue("stampValidityDays", null),
    [setFieldValue],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(event);
      form.setErrors({ ...form.errors, [event.target.name]: "" });
    },

    [form, onValueChange],
  );

  useFormErrorLogger(form.errors);

  return {
    ...form,
    dirty,
    handleChange,
    isSubmitting,
    onExpiryOff,
    onImagePickerClick: openFilePicker,
    imagePickerValue,
    values,
  };
};

export type StampAdminSettingsValues = Pick<
  UpdateProviderInput,
  "default_weight" | "admin_notes"
> & {
  stampValidityDays?: number | null;
};

export type StampAdminFormParameters = {
  data: ProviderExternal;
  isSubform?: boolean;
  onExpiryOff?: VoidFunction;
  disabled?: boolean;
};

export const useStampAdminForm = ({
  data,
  isSubform = false,
  onExpiryOff,
  disabled,
}: StampAdminFormParameters) => {
  const isStampValiditySet = data.stamp_validity_ms !== null;
  const { openDialog } = useDialogs();
  const { updateProvider } = useProviders();

  const [isExpiryEnabled, setIsExpiryEnabled] =
    useState<boolean>(isStampValiditySet);

  const initialValues: StampAdminSettingsValues = useMemo(
    () => ({
      default_weight: data.default_weight,

      stampValidityDays:
        typeof data.stamp_validity_ms === "number"
          ? millisecondsToDays(data.stamp_validity_ms)
          : data.stamp_validity_ms,

      admin_notes: data.admin_notes,
    }),

    [data.admin_notes, data.default_weight, data.stamp_validity_ms],
  );

  const onSubmit = useCallback(
    (
      {
        default_weight,
        stampValidityDays,
        admin_notes,
      }: StampAdminSettingsValues,
      actions: FormikHelpers<StampAdminSettingsValues>,
    ) => {
      actions.setSubmitting(true);

      const stamp_validity_ms = isExpiryEnabled
        ? daysToMilliseconds(stampValidityDays ?? 0)
        : null;

      sybilContract
        .update_provider({
          provider_id: data.id,

          default_weight:
            default_weight === data.default_weight ? undefined : default_weight,

          admin_notes:
            admin_notes === data.admin_notes ? undefined : admin_notes,

          stamp_validity_ms:
            stamp_validity_ms === data.stamp_validity_ms
              ? undefined
              : stamp_validity_ms,
        })
        .then(({ id: provider_id, ...updated }) => {
          updateProvider({ provider_id, ...updated });

          actions.resetForm({
            values: {
              default_weight: updated.default_weight,

              stampValidityDays: millisecondsToDays(
                updated.stamp_validity_ms ?? 0,
              ),
            },
          });
        })
        .catch((error) => {
          openDialog({
            dialog: DIALOGS.Error,

            props: {
              title: "Error",

              description: JSON.parse(error.message).kind
                .ExecutionError as string,
            },
          });
        })
        .finally(() => actions.setSubmitting(false));
    },

    [
      isExpiryEnabled,
      data.id,
      data.default_weight,
      data.admin_notes,
      data.stamp_validity_ms,
      updateProvider,
      openDialog,
    ],
  );

  const {
    dirty,
    handleChange,
    isSubmitting,
    isValid,
    setFieldValue,
    values,
    ...form
  } = useFormik<StampAdminSettingsValues>({
    initialValues,
    enableReinitialize: isSubform,
    onSubmit: isSubform ? () => void null : onSubmit,
  });

  const onExpirySwitch: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void = useCallback(
    (_, enabled) => {
      if (enabled) {
        setFieldValue("stampValidityDays", 0);
      } else onExpiryOff?.();

      setIsExpiryEnabled(enabled);
    },

    [onExpiryOff, setFieldValue],
  );

  const hasChanges = dirty || isExpiryEnabled !== isStampValiditySet;
  const isLocked = disabled || isSubmitting;

  useFormErrorLogger(form.errors);

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
