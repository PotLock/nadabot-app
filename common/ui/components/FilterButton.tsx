import CheckIcon from "@mui/icons-material/Check";
import { Typography } from "@mui/material";
import { CSSProperties } from "react";

import colors from "../colors";

type Props = {
  label: string;
  counter: string | number;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

export default function FilterButton({
  label,
  counter,
  active,
  onClick,
  style,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="filter-button"
      style={{
        ...(active
          ? { background: colors.PEACH, paddingRight: 16, paddingLeft: 16 }
          : { paddingRight: 28, paddingLeft: 28 }),
        ...style,
      }}
    >
      {active && <CheckIcon sx={{ fontSize: 16, color: "#F4B37D", mr: 1 }} />}
      <Typography fontSize={14} mr={0.5}>
        {label}
      </Typography>
      <Typography color={colors.NEUTRAL500}>({counter})</Typography>
    </button>
  );
}
