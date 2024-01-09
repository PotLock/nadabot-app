import { Button } from "@mui/material";

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
};

const variants = {
  white: "text",
  blue: "contained",
  beige: "contained",
};

type Props = {
  children: any;
  onClick?: () => void;
  fontSize?: "small" | "medium" | "large";
  bodySize?: "small" | "medium" | "large";
  color?: "white" | "blue" | "beige";
};

export default function CustomButton(props: Props) {
  return (
    <Button
      variant={props.color ? (variants[props.color] as any) : "text"}
      color={props.color ? (colors[props.color] as any) : "primary"}
      onClick={props.onClick}
      sx={{
        fontSize: fontSizes[props.fontSize || "small"],
        height: bodySizes[props.bodySize || "small"],
      }}
    >
      {props.children}
    </Button>
  );
}