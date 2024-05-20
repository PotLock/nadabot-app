import {
  Select as GenericSelect,
  SelectProps as GenericSelectProps,
  MenuItem,
  MenuItemProps,
  Stack,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import colors from "../colors";

export type SelectProps = Omit<GenericSelectProps, "color" | "variant"> & {
  label: string;

  options: {
    title: string;
    value: MenuItemProps["value"];
    disabled?: boolean;
  }[];

  width?: string | number;
};

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  width,
  ...props
}) => {
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
};
