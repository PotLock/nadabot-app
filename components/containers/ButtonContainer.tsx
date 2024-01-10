type Props = {
  children: JSX.Element;
  onClick?: () => void;
};

export default function ButtonContainer({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        border: "none",
        cursor: "pointer",
        background: "transparent",
      }}
    >
      {children}
    </button>
  );
}
