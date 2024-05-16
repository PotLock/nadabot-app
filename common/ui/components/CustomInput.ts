import { styled } from "@mui/system";

import colors from "@nadabot/common/ui/theme/colors";

const CustomInput = styled("input")({
  fontFamily: "Mona-Sans",
  fontWeight: 500,
  fontSize: 16,
  color: colors.NEUTRAL700,
  background: "transparent",
  "::placeholder": {
    color: colors.GRAY,
    opacity: 1,
  },
  width: "85%",
  border: "none",
  ":disabled": {
    opacity: 0.5,
  },
});

export default CustomInput;
