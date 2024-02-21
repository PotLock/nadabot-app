import { CSSProperties, forwardRef } from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
  onClick?: (e: any) => void;
  style?: CSSProperties;
  id?: string;
};

const ButtonContainer = forwardRef<HTMLButtonElement, Props>(
  function ButtonContainer({ children, onClick, style, id }, ref) {
    return (
      <button
        ref={ref}
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
  },
);

export default ButtonContainer;
