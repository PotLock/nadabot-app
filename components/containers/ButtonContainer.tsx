import { CSSProperties } from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
  onClick?: (e: any) => void;
  style?: CSSProperties;
  id?: string;
};

export default function ButtonContainer({
  children,
  onClick,
  style,
  id,
}: Props) {
  return (
    <button
      id={id}
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
