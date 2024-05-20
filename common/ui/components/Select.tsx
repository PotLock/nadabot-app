import {
  Select as GenericSelect,
  SelectProps as GenericSelectProps,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import colors from "../colors";

export type SelectProps<ValueType> = Omit<
  GenericSelectProps,
  "color" | "variant"
> & {
  label: string;
  options: { title: string; value: ValueType; disabled?: boolean }[];
  width?: string | number;
};

export function Select<ValueType>({
  label,
  options,
  width,
  ...props
}: SelectProps<
  ValueType extends string | number ? ValueType : string | number
>) {
  return (
    <Stack gap={0.5} {...{ width }}>
      <Typography
        color={colors.NEUTRAL950}
        fontWeight={600}
        fontSize={16}
        noWrap
      >
        {label}
      </Typography>

      <GenericSelect color="primary" variant="outlined" {...props}>
        {options.map(({ title, ...option }) => (
          <MenuItem key={uuidv4()} {...option}>
            {title}
          </MenuItem>
        ))}
      </GenericSelect>
    </Stack>
  );
}
