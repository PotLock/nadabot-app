import { styled } from "@mui/system";
import colors from "@nadabot/theme/colors";

const CustomInput = styled("input")({
  fontFamily: "Mona-Sans",
  fontWeight: 500,
  fontSize: 16,
  color: colors.GRAY,
  "::placeholder": {
    color: colors.GRAY,
    opacity: 1,
  },
  width: "85%",
  border: "none",
});

export default CustomInput;
