import { Button, ButtonProps } from "@mui/material";

import CustomCircularProgress from "./CustomCircularProgress";

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

const colors: Record<"white" | "blue" | "beige" | "red", ButtonProps["color"]> =
  {
    white: "primary",
    blue: "primary",
    beige: "warning",
    red: "error",
  };

const variants: Record<
  "white" | "blue" | "beige" | "red",
  ButtonProps["variant"]
> = {
  white: "text",
  blue: "contained",
  beige: "contained",
  red: "contained",
};

type Props = Pick<
  ButtonProps,
  "children" | "disabled" | "onMouseOut" | "onMouseOver" | "sx" | "type"
> & {
  bodySize?: "small" | "medium" | "large";
  color?: "white" | "blue" | "beige" | "red";
  fontSize?: "small" | "medium" | "large";
  onClick?: () => void;
  progress?: boolean;
};

export default function CustomButton({
  color = "white",
  bodySize,
  fontSize,
  progress = false,
  sx,
  children,
  ...props
}: Props) {
  return (
    <Button
      disableRipple
      variant={variants[color]}
      color={colors[color]}
      sx={{
        fontSize: fontSizes[fontSize ?? "small"],
        height: bodySizes[bodySize ?? "small"],
        ...sx,
      }}
      {...props}
    >
      <span style={{ visibility: progress ? "hidden" : "visible" }}>
        {children}
      </span>

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
