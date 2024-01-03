import { createTheme } from "@mui/material/styles";
import colors from "./colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.PRIMARY,
    },
    secondary: {
      main: colors.SECONDARY,
    },
    info: {
      main: colors.TRANSPARENT,
    },
    error: {
      main: colors.ERROR,
    },
    success: {
      main: colors.SUCCESS,
    },
  },
  typography: {
    fontFamily: ["Mona-Sans", "Roboto", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {},
  },
});
