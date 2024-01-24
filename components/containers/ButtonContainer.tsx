import { CSSProperties } from "react";

type Props = {
  children: JSX.Element;
  onClick?: () => void;
  style?: CSSProperties;
};

export default function ButtonContainer({ children, onClick, style }: Props) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        border: "none",
        cursor: "pointer",
        background: "transparent",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
