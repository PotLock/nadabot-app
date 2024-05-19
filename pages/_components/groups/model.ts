import { InferType, array, number, object, string } from "yup";

export const groupSchema = object().shape({
  group_name: string()
    .min(4, "Group name must be at least 4 characters long")
    .required("Group must have a name"),

  providers: array()
    .of(number().required())
    .min(1, "Group must have at least one provider")
    .required(),

  rule_type: string()
    .required()
    .oneOf([
      "Highest",
      "Lowest",
      "Sum",
      "DiminishingReturns",
      "IncreasingReturns",
    ])
    .required("Rule type is required")
    .default("Highest"),

  rule_threshold: number().nullable().optional(),
});

export type GroupSchema = InferType<typeof groupSchema>;

export const groupDefaults = groupSchema.getDefault();
