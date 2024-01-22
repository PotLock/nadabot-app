import { Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import colors from "@nadabot/theme/colors";

type Props = {
  label: string;
  counter: string | number;
  active?: boolean;
  onClick?: () => void;
};

export default function FilterButton({
  label,
  counter,
  active,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="filter-button"
      style={{
        ...(active
          ? { background: colors.PEACH, paddingRight: 16, paddingLeft: 16 }
          : { paddingRight: 28, paddingLeft: 28 }),
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
