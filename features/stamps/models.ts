import { InferType, number, object, string } from "yup";

import {
  MAX_PROVIDER_DESCRIPTION_LENGTH,
  MAX_PROVIDER_EXTERNAL_URL_LENGTH,
  MAX_PROVIDER_NAME_LENGTH,
} from "@nadabot/common/constants";
import { ProviderExternal } from "@nadabot/common/services/contracts/sybil.nadabot/interfaces/providers";

export const stampSchema = object().shape({
  icon_url: string().optional(),

  provider_name: string()
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
    .optional(),

  contract_id: string()
    .min(4, "Insert a valid contract account id")
    .required("Insert a valid contract account id"),

  method_name: string()
    .min(3, "Insert a valid method name")
    .required("Insert a valid method name"),

  account_id_arg_name: string().optional(),

  external_url: string()
    .min(4, "Insert a valid external link")
    .max(
      MAX_PROVIDER_EXTERNAL_URL_LENGTH,
      `Link shouldn't exceed ${MAX_PROVIDER_EXTERNAL_URL_LENGTH} characters`,
    )
    .optional(),

  gas: number().nullable().optional(),

  custom_args: string()
    .nullable()
    .transform((input: ProviderExternal["custom_args"]) =>
      typeof input === "string" && input.length === 0 ? undefined : input,
    )
    .test({
      message: "Invalid JSON. Custom arguments must be an object.",

      test: (input) => {
        if (typeof input === "string") {
          try {
            const parsedInput = JSON.parse(input);

            return (
              typeof parsedInput === "object" && !Array.isArray(parsedInput)
            );
          } catch {
            return false;
          }
        } else return true;
      },
    })
    .optional(),

  // Admin Settings

  default_weight: number()
    .min(1, "Weight should be greater than 0")
    .max(100, "Weight should be less than or equal to 100")
    .optional(),

  stamp_validity_ms: number().min(0).nullable().optional(),

  admin_notes: string().nullable().optional(),
});

export type StampSchema = InferType<typeof stampSchema>;
