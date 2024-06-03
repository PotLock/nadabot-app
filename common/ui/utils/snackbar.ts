import { createContext, useContext } from "react";

export type OpenSnackbarProps = {
  description: string;
  actionText?: string;
  bgColor?: "blue" | "red";
  onClickActionText?: () => void;
};

export type SnackbarContextProps = {
  showSnackbar: (props: OpenSnackbarProps) => void;
};

export const SnackbarContext = createContext<SnackbarContextProps>({
  showSnackbar: () => {
    throw new Error("showSnackbar must be defined");
  },
});

const useSnackbar = () => useContext(SnackbarContext);
export default useSnackbar;
