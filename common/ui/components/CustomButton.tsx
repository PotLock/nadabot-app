import { Button, ButtonProps, Stack } from "@mui/material";

import CustomCircularProgress from "./CustomCircularProgress";

type CustomButtonColor = "blue" | "peach" | "red" | "black";

const fontSizes = {
  small: 14,
  medium: 26,
  large: 36,
};

const bodySizes = {
  small: 36,
  medium: 48,
  large: 68,
};

const colors: Record<CustomButtonColor, ButtonProps["color"]> = {
  blue: "primary",
  peach: "info",
  red: "error",
  black: "secondary",
};

const variants: Record<CustomButtonColor, ButtonProps["variant"]> = {
  blue: "contained",
  peach: "contained",
  red: "contained",
  black: "contained",
};

export type CustomButtonProps = Pick<
  ButtonProps,
  | "children"
  | "disabled"
  | "onMouseOut"
  | "onMouseOver"
  | "sx"
  | "type"
  | "variant"
> & {
  bodySize?: "small" | "medium" | "large";
  color?: CustomButtonColor;
  fontSize?: "small" | "medium" | "large";
  onClick?: () => void;
  progress?: boolean;
};

export default function CustomButton({
  color = "peach",
  bodySize,
  fontSize,
  progress = false,
  sx,
  variant,
  children,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      disableRipple
      variant={variant ?? variants[color]}
      color={colors[color]}
      sx={{
        fontSize: fontSizes[fontSize ?? "small"],
        height: bodySizes[bodySize ?? "medium"],
        ...sx,
      }}
      {...props}
    >
      <Stack
        visibility={progress ? "hidden" : "visible"}
        gap={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="nowrap"
        whiteSpace="nowrap"
      >
        {children}
      </Stack>

      <CustomCircularProgress
        size={26}
        sx={{
          width: "100%",
          position: "absolute",
          p: 0,
          visibility: progress ? "visile" : "hidden",
        }}
      />
    </Button>
  );
}
