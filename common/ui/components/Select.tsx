import CheckIcon from "@mui/icons-material/Check";
import {
  Select as GenericSelect,
  SelectProps as GenericSelectProps,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import colors from "../colors";

export type SelectProps<ValueType> = Omit<
  GenericSelectProps<ValueType>,
  "color" | "variant" | "renderValue"
> & {
  label: string;
  options: { title: string; value: ValueType; disabled?: boolean }[];
  width?: string | number;
};

export function Select<ValueType>({
  label,
  options,
  width,
  sx,
  ...props
}: SelectProps<
  ValueType extends string | number ? ValueType : string | number
>) {
  const valueRenderer = useCallback(
    (value: unknown) =>
      options.find((option) => option.value === value)?.title ?? "Unknown",

    [options],
  );

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

      <GenericSelect
        color="primary"
        variant="outlined"
        renderValue={valueRenderer}
        sx={{ ...sx, height: 48 }}
        {...props}
      >
        {options.map(({ title, ...option }) => (
          <MenuItem
            key={uuidv4()}
            {...option}
            sx={{ gap: 2, alignItems: "start" }}
            disableRipple
          >
            {(props.defaultValue ?? props.value) === option.value ? (
              <CheckIcon fontSize="small" />
            ) : (
              <span style={{ width: 20, height: 20 }} />
            )}

            <Typography>{title}</Typography>
          </MenuItem>
        ))}
      </GenericSelect>
    </Stack>
  );
}
