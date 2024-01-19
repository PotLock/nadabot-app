import { Button, SxProps, Theme } from "@mui/material";

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

const colors = {
  white: "primary",
  blue: "primary",
  beige: "warning",
  red: "error",
};

const variants = {
  white: "text",
  blue: "contained",
  beige: "contained",
  red: "contained",
};

type Props = {
  children: any;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  fontSize?: "small" | "medium" | "large";
  bodySize?: "small" | "medium" | "large";
  color?: "white" | "blue" | "beige" | "red";
  sx?: SxProps<Theme>;
  disabled?: boolean;
};

export default function CustomButton(props: Props) {
  return (
    <Button
      disabled={props.disabled}
      variant={props.color ? (variants[props.color] as any) : "text"}
      color={props.color ? (colors[props.color] as any) : "primary"}
      onClick={props.onClick}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
      sx={{
        fontSize: fontSizes[props.fontSize || "small"],
        height: bodySizes[props.bodySize || "small"],
        ...(props.sx ? props.sx : {}),
      }}
    >
      {props.children}
    </Button>
  );
}
