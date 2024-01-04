import { styled } from "@mui/system";
import colors from "@nadabot/theme/colors";

const RoundedSearchButton = styled("button")({
  cursor: "pointer",
  background: colors.BUTTON_PRIMARY,
  borderRadius: 32,
  padding: "8px 12px",
  border: "none",
  width: 56,
  height: 40,
  marginRight: 4,
  ":active": {
    backgroundColor: colors.BUTTON_PRIMARY_ACTIVE,
  },
});

export default RoundedSearchButton;
