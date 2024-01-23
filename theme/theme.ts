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
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          fontWeight: "500px",
          fontSize: "12px",
          color: colors.NEUTRAL,
        },
      },
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
          marginBottom: "3.7px",
          transition: "margin .1s, box-shadow .1s",
          boxShadow: `0px 2.7px 0px 0px ${colors.PRIMARY}`,
          ":hover": {
            boxShadow: "none",
            marginTop: "3.7px",
            marginBottom: "0px",
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary", size: "small" },
          style: {
            paddingTop: "12px",
            backgroundColor: colors.BUTTON_PRIMARY,
            ":hover": {
              backgroundColor: colors.BUTTON_PRIMARY,
            },
            ":active": {
              backgroundColor: colors.BUTTON_PRIMARY_ACTIVE,
            },
            ":disabled": {
              color: colors.WHITE,
              backgroundColor: colors.BUTTON_PRIMARY,
              opacity: ".6",
            },
          },
        },
        {
          props: { variant: "contained", color: "primary", size: "medium" },
          style: {
            paddingTop: "12px",
            fontSize: "26px",
            fontWeight: 600,
            backgroundColor: colors.BUTTON_PRIMARY,
            ":hover": {
              backgroundColor: colors.BUTTON_PRIMARY,
            },
            ":active": {
              backgroundColor: colors.BUTTON_PRIMARY_ACTIVE,
            },
            ":disabled": {
              color: colors.WHITE,
              backgroundColor: colors.BUTTON_PRIMARY,
              opacity: ".6",
            },
          },
        },
        {
          props: { variant: "contained", color: "primary", size: "large" },
          style: {
            paddingTop: "12px",
            fontSize: "36px",
            fontWeight: 600,
            backgroundColor: colors.BUTTON_PRIMARY,
            ":hover": {
              backgroundColor: colors.BUTTON_PRIMARY,
            },
            ":active": {
              backgroundColor: colors.BUTTON_PRIMARY_ACTIVE,
            },
            ":disabled": {
              color: colors.WHITE,
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
            color: colors.WHITE,
            ":hover": {
              backgroundColor: colors.BUTTON_SECONDARY,
            },
            ":active": {
              backgroundColor: colors.BUTTON_SECONDARY_ACTIVE,
            },
            ":disabled": {
              color: colors.WHITE,
              backgroundColor: colors.BUTTON_SECONDARY,
              opacity: ".6",
            },
          },
        },
        {
          props: { variant: "contained", color: "warning" },
          style: {
            paddingTop: "12px",
            backgroundColor: colors.PEACH,
            color: colors.PRIMARY,
            ":hover": {
              backgroundColor: colors.PEACH,
            },
            ":active": {
              backgroundColor: colors.PEACH100,
            },
            ":disabled": {
              color: colors.PRIMARY,
              backgroundColor: colors.PEACH,
              opacity: ".6",
            },
          },
        },
        {
          props: { size: "large" },
          style: {
            height: "68px",
            fontSize: "36px",
            fontWeight: 600,
          },
        },
        {
          props: { size: "medium" },
          style: {
            height: "48px",
            // "@media (max-width: 600px)": {
            //   fontSize: "14px",
            // },
          },
        },
        {
          props: { size: "small" },
          style: {
            height: "36px",
            // minHeight: "40px",
            // fontSize: "13px",
            // paddingLeft: "16px",
            // paddingRight: "16px",
          },
        },
      ],
    },
  },
});
