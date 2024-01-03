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
    MuiLink: {
      variants: [
        {
          props: { component: "button", variant: "body2" },
          style: {
            fontWeight: "600",
            fontSize: "14px",
            textDecorationColor: colors.TERTIARY,
            color: colors.TERTIARY,
            ":hover": {
              color: colors.BUTTON_SECONDARY_ACTIVE,
              textDecorationColor: colors.BUTTON_SECONDARY_ACTIVE,
            },
          },
        },
      ],
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          padding: "8px 24px",
          fontSize: "14px",
          fontWeight: "600",
          letterSpacing: "0.01em",
          textTransform: "none",
          border: `2px solid ${colors.PRIMARY}`,
          marginTop: "0px",
          transition: "margin .1s, box-shadow .1s",
          boxShadow: `0px 2.7px 0px 0px ${colors.PRIMARY}`,
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary", size: "small" },
          style: {
            paddingTop: "12px",
            backgroundColor: colors.BUTTON_PRIMARY,
            height: "36px",
            ":hover": {
              boxShadow: "none",
              marginTop: "3.7px",
              backgroundColor: colors.BUTTON_PRIMARY,
            },
            ":active": {
              backgroundColor: colors.BUTTON_PRIMARY_ACTIVE,
            },
            ":disabled": {
              color: colors.SECONDARY,
              backgroundColor: colors.BUTTON_PRIMARY,
              opacity: ".6",
            },
          },
        },
        {
          props: { variant: "contained", color: "secondary", size: "small" },
          style: {
            paddingTop: "12px",
            backgroundColor: colors.BUTTON_SECONDARY,
            height: "36px",
            color: colors.SECONDARY,
            ":hover": {
              boxShadow: "none",
              marginTop: "3.7px",
              backgroundColor: colors.BUTTON_SECONDARY,
            },
            ":active": {
              backgroundColor: colors.BUTTON_SECONDARY_ACTIVE,
            },
            ":disabled": {
              color: colors.SECONDARY,
              backgroundColor: colors.BUTTON_SECONDARY,
              opacity: ".6",
            },
          },
        },
        // {
        //   props: { variant: "outlined", color: "secondary" },
        //   style: {
        //     color: colors.SECONDARY,
        //     borderColor: colors.SECONDARY,
        //     backgroundColor: "transparent",

        //     ":hover": {
        //       color: colors.SECONDARY_HOVER_BG,
        //       borderColor: colors.SECONDARY_HOVER_BG,
        //       backgroundColor: "transparent",
        //     },
        //     ":active": {
        //       color: colors.SECONDARY_ACTIVE_BG,
        //       borderColor: colors.SECONDARY_ACTIVE_BG,
        //       backgroundColor: "transparent",
        //     },
        //     ":disabled": {
        //       color: colors.SECONDARY_DISABLED_BG,
        //       borderColor: colors.SECONDARY_DISABLED_BG,
        //       backgroundColor: "transparent",
        //     },
        //   },
        // },
        // {
        //   props: { size: "large" },
        //   style: {
        //     height: "56px",
        //   },
        // },
        // {
        //   props: { size: "medium" },
        //   style: {
        //     height: "56px",
        //     "@media (max-width: 600px)": {
        //       fontSize: "14px",
        //     },
        //   },
        // },
        // {
        //   props: { size: "small" },
        //   style: {
        //     height: "unset",
        //     minHeight: "40px",
        //     fontSize: "13px",
        //     paddingLeft: "16px",
        //     paddingRight: "16px",
        //   },
        // },
      ],
    },
  },
});
